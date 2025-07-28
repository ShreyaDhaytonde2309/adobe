// Adobe Hackathon - PDF Analyzer
// Interactive JavaScript for enhanced user experience

class PDFAnalyzer {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeAnimations();
        this.setupFileUpload();
        this.setupFormValidation();
    }

    setupEventListeners() {
        // File upload events
        const fileInput = document.getElementById('pdf-file');
        const fileWrapper = document.querySelector('.file-upload-wrapper');
        
        if (fileInput && fileWrapper) {
            // Click to upload
            fileWrapper.addEventListener('click', () => fileInput.click());
            
            // File selection
            fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
            
            // Drag and drop
            fileWrapper.addEventListener('dragover', (e) => this.handleDragOver(e));
            fileWrapper.addEventListener('dragleave', (e) => this.handleDragLeave(e));
            fileWrapper.addEventListener('drop', (e) => this.handleFileDrop(e));
        }

        // Form submission
        const form = document.querySelector('#upload-form');
        if (form) {
            form.addEventListener('submit', (e) => this.handleFormSubmit(e));
        }

        // Input animations
        const inputs = document.querySelectorAll('.form-input');
        inputs.forEach(input => {
            input.addEventListener('focus', (e) => this.animateInputFocus(e));
            input.addEventListener('blur', (e) => this.animateInputBlur(e));
        });

        // Button hover effects
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(button => {
            button.addEventListener('mouseenter', (e) => this.animateButtonHover(e));
            button.addEventListener('mouseleave', (e) => this.animateButtonLeave(e));
        });
    }

    setupFileUpload() {
        const fileWrapper = document.querySelector('.file-upload-wrapper');
        if (!fileWrapper) return;

        // Prevent default drag behaviors
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            fileWrapper.addEventListener(eventName, (e) => {
                e.preventDefault();
                e.stopPropagation();
            });
        });
    }

    handleFileSelect(e) {
        const file = e.target.files[0];
        if (file) {
            this.displaySelectedFile(file);
            this.validateFile(file);
        }
    }

    handleDragOver(e) {
        e.preventDefault();
        const wrapper = e.currentTarget;
        wrapper.classList.add('dragover');
        this.animateDragOver(wrapper);
    }

    handleDragLeave(e) {
        e.preventDefault();
        const wrapper = e.currentTarget;
        wrapper.classList.remove('dragover');
    }

    handleFileDrop(e) {
        e.preventDefault();
        const wrapper = e.currentTarget;
        wrapper.classList.remove('dragover');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            const file = files[0];
            const fileInput = document.getElementById('pdf-file');
            
            // Create a new FileList-like object
            const dt = new DataTransfer();
            dt.items.add(file);
            fileInput.files = dt.files;
            
            this.displaySelectedFile(file);
            this.validateFile(file);
        }
    }

    displaySelectedFile(file) {
        const selectedDiv = document.querySelector('.file-selected');
        const uploadText = document.querySelector('.file-upload-content');
        
        if (selectedDiv && uploadText) {
            selectedDiv.innerHTML = `
                <span class="file-icon">📄</span>
                <span class="file-name">${file.name}</span>
                <span class="file-size">(${this.formatFileSize(file.size)})</span>
            `;
            selectedDiv.style.display = 'flex';
            uploadText.style.opacity = '0.5';
            
            // Animate the appearance
            selectedDiv.style.animation = 'fadeInUp 0.5s ease-out';
        }
    }

    validateFile(file) {
        const maxSize = 50 * 1024 * 1024; // 50MB
        const allowedTypes = ['application/pdf'];
        
        if (!allowedTypes.includes(file.type)) {
            this.showToast('Please select a valid PDF file.', 'error');
            return false;
        }
        
        if (file.size > maxSize) {
            this.showToast('File size must be less than 50MB.', 'error');
            return false;
        }
        
        this.showToast('PDF file selected successfully!', 'success');
        return true;
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    handleFormSubmit(e) {
        const form = e.target;
        const fileInput = document.getElementById('pdf-file');
        
        if (!fileInput.files[0]) {
            e.preventDefault();
            this.showToast('Please select a PDF file first.', 'error');
            return;
        }
        
        // Show loading state
        this.showLoadingState();
        
        // Add some visual feedback
        const submitBtn = form.querySelector('.btn-primary');
        if (submitBtn) {
            submitBtn.innerHTML = `
                <div class="spinner"></div>
                Analyzing PDF...
            `;
            submitBtn.disabled = true;
        }
    }

    showLoadingState() {
        const loading = document.querySelector('.loading');
        if (loading) {
            loading.style.display = 'flex';
            loading.style.animation = 'fadeInUp 0.5s ease-out';
        }
        
        // Add overlay
        const overlay = document.createElement('div');
        overlay.className = 'loading-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            backdrop-filter: blur(5px);
        `;
        
        overlay.innerHTML = `
            <div style="background: white; padding: 2rem; border-radius: 16px; text-align: center; box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);">
                <div class="spinner" style="width: 40px; height: 40px; margin: 0 auto 1rem;"></div>
                <h3 style="margin-bottom: 0.5rem; color: #1a202c;">Analyzing Your PDF</h3>
                <p style="color: #4a5568;">This may take a few moments...</p>
            </div>
        `;
        
        document.body.appendChild(overlay);
    }

    animateInputFocus(e) {
        const input = e.target;
        const parent = input.parentElement;
        parent.style.transform = 'translateY(-2px)';
        parent.style.transition = 'transform 0.3s ease';
    }

    animateInputBlur(e) {
        const input = e.target;
        const parent = input.parentElement;
        parent.style.transform = 'translateY(0)';
    }

    animateButtonHover(e) {
        const button = e.target;
        button.style.transform = 'translateY(-2px) scale(1.02)';
        button.style.boxShadow = '0 32px 64px rgba(0, 0, 0, 0.15)';
    }

    animateButtonLeave(e) {
        const button = e.target;
        button.style.transform = 'translateY(0) scale(1)';
        button.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.1)';
    }

    animateDragOver(wrapper) {
        wrapper.style.animation = 'pulse 1s ease-in-out infinite';
    }

    initializeAnimations() {
        // Intersection Observer for scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'fadeInUp 0.8s ease-out forwards';
                }
            });
        }, observerOptions);

        // Observe elements for scroll animations
        const animatedElements = document.querySelectorAll('.upload-card, .form-group');
        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            observer.observe(el);
        });

        // Stagger animations
        animatedElements.forEach((el, index) => {
            setTimeout(() => {
                el.style.animation = `fadeInUp 0.8s ease-out ${index * 0.1}s forwards`;
            }, 100);
        });
    }

    showToast(message, type = 'info') {
        // Remove existing toasts
        const existingToasts = document.querySelectorAll('.toast');
        existingToasts.forEach(toast => toast.remove());

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.5rem;">
                <span class="toast-icon">${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}</span>
                <span>${message}</span>
            </div>
        `;

        document.body.appendChild(toast);

        // Show toast
        setTimeout(() => toast.classList.add('show'), 100);

        // Auto-hide toast
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    }

    // Utility function for smooth scrolling
    smoothScrollTo(target) {
        const element = document.querySelector(target);
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    // Create floating particles effect
    createFloatingParticles() {
        const particlesContainer = document.createElement('div');
        particlesContainer.className = 'floating-particles';
        particlesContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -1;
        `;

        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: ${Math.random() * 6 + 2}px;
                height: ${Math.random() * 6 + 2}px;
                background: rgba(255, 64, 129, ${Math.random() * 0.5 + 0.1});
                border-radius: 50%;
                animation: floatParticle ${Math.random() * 20 + 10}s infinite linear;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
            `;
            particlesContainer.appendChild(particle);
        }

        document.body.appendChild(particlesContainer);

        // Add particle animation keyframes
        const style = document.createElement('style');
        style.textContent = `
            @keyframes floatParticle {
                0% { transform: translateY(100vh) rotate(0deg); opacity: 1; }
                100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
}

// PDF Viewer functionality
class PDFViewer {
    constructor() {
        this.initViewer();
    }

    initViewer() {
        // Initialize Adobe PDF Embed API when ready
        document.addEventListener("adobe_dc_view_sdk.ready", () => {
            this.setupAdobeViewer();
        });

        this.setupInsightsPanel();
        this.addViewerControls();
    }

    setupAdobeViewer() {
        const viewerElement = document.getElementById("adobe-dc-view");
        if (!viewerElement) return;

        try {
            const adobeDCView = new AdobeDC.View({
                clientId: "2bad0879408e42e187391f114226cb41", // Replace with actual Adobe client ID
                divId: "adobe-dc-view"
            });

            const pdfUrl = viewerElement.dataset.pdfUrl;
            const fileName = viewerElement.dataset.fileName || "document.pdf";

            adobeDCView.previewFile({
                content: { location: { url: pdfUrl } },
                metaData: { fileName: fileName }
            }, {
                embedMode: "SIZED_CONTAINER",
                showAnnotationTools: true,
                showLeftHandPanel: false,
                showDownloadPDF: false,
                enableFormFilling: false
            });

        } catch (error) {
            console.error("Adobe PDF viewer initialization failed:", error);
            this.showFallbackViewer();
        }
    }

    showFallbackViewer() {
        const viewerElement = document.getElementById("adobe-dc-view");
        if (viewerElement) {
            const pdfUrl = viewerElement.dataset.pdfUrl;
            viewerElement.innerHTML = `
                <iframe 
                    src="${pdfUrl}" 
                    width="100%" 
                    height="100%" 
                    style="border: none; border-radius: 8px;">
                </iframe>
            `;
        }
    }

    setupInsightsPanel() {
        const insightsData = window.insightsData;
        if (!insightsData) return;

        const container = document.querySelector('.insights-content');
        if (!container) return;

        container.innerHTML = '';

        // Process and display insights
        if (Array.isArray(insightsData)) {
            insightsData.forEach((insight, index) => {
                this.createInsightItem(insight, index, container);
            });
        } else if (typeof insightsData === 'object') {
            Object.entries(insightsData).forEach(([key, value], index) => {
                this.createInsightItem({ title: key, content: value }, index, container);
            });
        }

        // Add search functionality
        this.addInsightsSearch();
    }

    createInsightItem(insight, index, container) {
        const item = document.createElement('div');
        item.className = 'insight-item';
        item.style.animationDelay = `${index * 0.1}s`;
        
        const title = insight.title || insight.section || `Insight ${index + 1}`;
        const content = insight.content || insight.text || insight.description || JSON.stringify(insight);
        
        item.innerHTML = `
            <div class="insight-header">
                <h3 class="insight-title">${title}</h3>
                <div class="insight-actions">
                    <button class="insight-btn" onclick="this.parentElement.parentElement.parentElement.classList.toggle('expanded')">
                        <span class="expand-icon">▼</span>
                    </button>
                </div>
            </div>
            <div class="insight-content-text">
                <p class="insight-text">${content}</p>
            </div>
        `;
        
        container.appendChild(item);
    }

    addInsightsSearch() {
        const header = document.querySelector('.insights-header');
        if (!header) return;

        const searchContainer = document.createElement('div');
        searchContainer.className = 'insights-search';
        searchContainer.innerHTML = `
            <input 
                type="text" 
                placeholder="Search insights..." 
                class="search-input"
                id="insights-search"
            >
        `;
        
        header.appendChild(searchContainer);

        // Add search functionality
        const searchInput = document.getElementById('insights-search');
        searchInput.addEventListener('input', (e) => {
            this.filterInsights(e.target.value);
        });
    }

    filterInsights(searchTerm) {
        const insights = document.querySelectorAll('.insight-item');
        const term = searchTerm.toLowerCase();

        insights.forEach(insight => {
            const title = insight.querySelector('.insight-title').textContent.toLowerCase();
            const content = insight.querySelector('.insight-text').textContent.toLowerCase();
            
            if (title.includes(term) || content.includes(term)) {
                insight.style.display = 'block';
                insight.style.animation = 'fadeInUp 0.3s ease-out';
            } else {
                insight.style.display = 'none';
            }
        });
    }

    addViewerControls() {
        const viewerContainer = document.querySelector('.pdf-viewer');
        if (!viewerContainer) return;

        const controls = document.createElement('div');
        controls.className = 'viewer-controls';
        controls.innerHTML = `
            <div class="control-group">
                <button class="control-btn" id="zoom-in" title="Zoom In">🔍+</button>
                <button class="control-btn" id="zoom-out" title="Zoom Out">🔍-</button>
                <button class="control-btn" id="fit-width" title="Fit Width">↔️</button>
                <button class="control-btn" id="toggle-insights" title="Toggle Insights">📊</button>
            </div>
        `;

        viewerContainer.appendChild(controls);

        // Add control event listeners
        document.getElementById('toggle-insights').addEventListener('click', () => {
            this.toggleInsightsPanel();
        });
    }

    toggleInsightsPanel() {
        const panel = document.querySelector('.insights-panel');
        const viewer = document.querySelector('.pdf-viewer');
        
        if (panel.style.display === 'none') {
            panel.style.display = 'flex';
            viewer.style.width = 'calc(100% - 400px)';
        } else {
            panel.style.display = 'none';
            viewer.style.width = '100%';
        }
    }
}

// Utility functions
const Utils = {
    // Debounce function for performance
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Throttle function for scroll events
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // Format text for display
    formatText(text, maxLength = 200) {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    },

    // Copy text to clipboard
    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (err) {
            console.error('Failed to copy text: ', err);
            return false;
        }
    },

    // Generate random ID
    generateId() {
        return Math.random().toString(36).substr(2, 9);
    }
};

// Performance monitoring
class PerformanceMonitor {
    constructor() {
        this.metrics = {
            loadTime: 0,
            renderTime: 0,
            interactionTime: 0
        };
        this.init();
    }

    init() {
        // Monitor page load time
        window.addEventListener('load', () => {
            this.metrics.loadTime = performance.now();
            console.log(`Page loaded in ${this.metrics.loadTime.toFixed(2)}ms`);
        });

        // Monitor DOM content loaded
        document.addEventListener('DOMContentLoaded', () => {
            this.metrics.renderTime = performance.now();
            console.log(`DOM rendered in ${this.metrics.renderTime.toFixed(2)}ms`);
        });
    }

    measureInteraction(action, callback) {
        const start = performance.now();
        const result = callback();
        const end = performance.now();
        
        console.log(`${action} took ${(end - start).toFixed(2)}ms`);
        return result;
    }
}

// Error handling
class ErrorHandler {
    constructor() {
        this.setupGlobalErrorHandling();
    }

    setupGlobalErrorHandling() {
        window.addEventListener('error', (event) => {
            this.logError('JavaScript Error', event.error);
        });

        window.addEventListener('unhandledrejection', (event) => {
            this.logError('Unhandled Promise Rejection', event.reason);
        });
    }

    logError(type, error) {
        console.error(`${type}:`, error);
        
        // Show user-friendly error message
        this.showErrorToast(`Something went wrong. Please try again.`);
        
        // In production, you might want to send errors to a logging service
        // this.sendErrorToService(type, error);
    }

    showErrorToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast error';
        toast.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.5rem;">
                <span>❌</span>
                <span>${message}</span>
            </div>
        `;

        document.body.appendChild(toast);
        setTimeout(() => toast.classList.add('show'), 100);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 5000);
    }
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize main components
    const pdfAnalyzer = new PDFAnalyzer();
    const performanceMonitor = new PerformanceMonitor();
    const errorHandler = new ErrorHandler();
    
    // Initialize PDF viewer if on viewer page
    if (document.getElementById('adobe-dc-view')) {
        const pdfViewer = new PDFViewer();
    }

    // Add floating particles effect
    if (document.querySelector('.animated-bg')) {
        pdfAnalyzer.createFloatingParticles();
    }

    // Add smooth scrolling to all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + Enter to submit form
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            const form = document.querySelector('#upload-form');
            if (form) {
                form.dispatchEvent(new Event('submit'));
            }
        }
        
        // Escape to close modals/overlays
        if (e.key === 'Escape') {
            const overlay = document.querySelector('.loading-overlay');
            if (overlay) {
                overlay.remove();
            }
        }
    });

    // Add progress indicator for long operations
    let progressIndicator = null;
    
    function showProgress(message = 'Processing...') {
        if (progressIndicator) {
            progressIndicator.remove();
        }
        
        progressIndicator = document.createElement('div');
        progressIndicator.className = 'progress-indicator';
        progressIndicator.innerHTML = `
            <div class="progress-bar">
                <div class="progress-fill"></div>
            </div>
            <p>${message}</p>
        `;
        
        document.body.appendChild(progressIndicator);
    }
    
    function hideProgress() {
        if (progressIndicator) {
            progressIndicator.remove();
            progressIndicator = null;
        }
    }

    // Expose utilities globally for debugging
    window.PDFAnalyzerUtils = {
        Utils,
        PerformanceMonitor,
        ErrorHandler,
        showProgress,
        hideProgress
    };

    console.log('🚀 Adobe Hackathon PDF Analyzer initialized successfully!');
});

// Service Worker registration for offline functionality
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}