from flask import Flask, request, jsonify, render_template, redirect, url_for, send_from_directory
import subprocess, os, uuid, json

app = Flask(__name__)

UPLOAD_FOLDER = "static"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route("/", methods=["GET"])
def home():
    return render_template('index.html')

@app.route("/pdfs/<filename>")
def serve_pdf(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)

@app.route('/analyze', methods=['POST'])
def analyze_pdf():
    file = request.files['pdf']
    
    # Save uploaded file with unique name
    pdf_id = str(uuid.uuid4())[:8]
    pdf_filename = f'{pdf_id}_{file.filename}'
    pdf_path = os.path.join(UPLOAD_FOLDER, pdf_filename)
    file.save(pdf_path)

    outline_json = f"{pdf_id}_outline.json"
    ranked_json = f"{pdf_id}_ranked.json"
    persona_txt = f"{pdf_id}_persona.txt"
    job_txt = f"{pdf_id}_job.txt"

    # Step 1: Run Round 1a extractor
    result1a = subprocess.run(
        ['python', '../round1a_outline_extractor/main.py', pdf_path, outline_json],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE
    )

    # Check if Round 1a succeeded and file was created
    if not os.path.exists(outline_json):
        return render_template("error.html", message="Failed to extract outline. Make sure Round 1a script works.")

    persona = request.form.get('persona', '')
    job = request.form.get('job', '')

    # Step 2: Run Round 1b if persona/job provided
    if persona and job:
        with open(persona_txt, 'w') as f:
            f.write(persona)
        with open(job_txt, 'w') as f:
            f.write(job)

        result1b = subprocess.run(
            ['python', '../round1b_persona_extractor/main.py', outline_json, persona_txt, job_txt, ranked_json],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE
        )

        if os.path.exists(ranked_json):
            with open(ranked_json, 'r') as f:
                insights = json.load(f)
        else:
            return render_template("error.html", message="Analysis failed — ranked JSON file not found after Round 1b.")
    else:
        # If persona/job not provided, just use outline
        with open(outline_json, 'r') as f:
            insights = json.load(f)

    # Final viewer rendering
    return render_template(
        "viewer.html",
        pdf_url=url_for('serve_pdf', filename=pdf_filename),
        insights=insights
    )

if __name__ == "__main__":
    app.run(debug=True)
