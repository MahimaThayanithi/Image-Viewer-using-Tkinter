 document.addEventListener('DOMContentLoaded', function() {
            // Elements
            const imageContainer = document.getElementById('imageContainer');
            const displayedImage = document.getElementById('displayedImage');
            const imageTitle = document.getElementById('imageTitle');
            const fileInput = document.getElementById('fileInput');
            
            // Buttons
            const openFolderBtn = document.getElementById('openFolder');
            const prevImageBtn = document.getElementById('prevImage');
            const nextImageBtn = document.getElementById('nextImage');
            const zoomInBtn = document.getElementById('zoomIn');
            const zoomOutBtn = document.getElementById('zoomOut');
            const startSlideshowBtn = document.getElementById('startSlideshow');
            const stopSlideshowBtn = document.getElementById('stopSlideshow');
            const toggleFullscreenBtn = document.getElementById('toggleFullscreen');
            const exitBtn = document.getElementById('exitButton');
            
            // State
            let imageList = [];
            let currentImage = 0;
            let zoomLevel = 1.0;
            let slideshowActive = false;
            let slideshowInterval;
            let isFullscreen = false;
            let fullscreenElement;
            
            // Supported image formats
            const supportedFormats = ['.jpg', '.jpeg', '.png', '.bmp', '.gif'];
            
            // Event listeners
            openFolderBtn.addEventListener('click', openFolder);
            prevImageBtn.addEventListener('click', prevImage);
            nextImageBtn.addEventListener('click', nextImage);
            zoomInBtn.addEventListener('click', zoomIn);
            zoomOutBtn.addEventListener('click', zoomOut);
            startSlideshowBtn.addEventListener('click', startSlideshow);
            stopSlideshowBtn.addEventListener('click', stopSlideshow);
            toggleFullscreenBtn.addEventListener('click', toggleFullscreen);
            exitBtn.addEventListener('click', () => {
                stopSlideshow();
                window.close();
            });
            
            fileInput.addEventListener('change', handleFileSelection);
            
            // Functions
            function openFolder() {
                fileInput.click();
            }
            
            function handleFileSelection(event) {
                const files = Array.from(event.target.files);
                imageList = files.filter(file => {
                    const extension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
                    return supportedFormats.includes(extension);
                });
                
                if (imageList.length > 0) {
                    currentImage = 0;
                    zoomLevel = 1.0;
                    displayImage();
                } else {
                    alert('No supported image files found in this folder.');
                }
            }
            
            function displayImage() {
                if (imageList.length === 0) return;
                
                const file = imageList[currentImage];
                const reader = new FileReader();
                
                reader.onload = function(e) {
                    displayedImage.src = e.target.result;
                    displayedImage.style.display = 'block';
                    imageTitle.textContent = file.name;
                    applyZoom();
                };
                
                reader.readAsDataURL(file);
            }
            
            function applyZoom() {
                if (!displayedImage.src) return;
                
                displayedImage.style.transform = `scale(${zoomLevel})`;
                displayedImage.style.transformOrigin = 'center center';
            }
            
            function nextImage() {
                if (imageList.length === 0) return;
                
                currentImage = (currentImage + 1) % imageList.length;
                zoomLevel = 1.0;
                displayImage();
            }
            
            function prevImage() {
                if (imageList.length === 0) return;
                
                currentImage = (currentImage - 1 + imageList.length) % imageList.length;
                zoomLevel = 1.0;
                displayImage();
            }
            
            function zoomIn() {
                zoomLevel *= 1.25;
                applyZoom();
            }
            
            function zoomOut() {
                zoomLevel /= 1.25;
                applyZoom();
            }
            
            function startSlideshow() {
                if (imageList.length === 0 || slideshowActive) return;
                
                slideshowActive = true;
                slideshowInterval = setInterval(nextImage, 2000);
            }
            
            function stopSlideshow() {
                slideshowActive = false;
                clearInterval(slideshowInterval);
            }
            
            function toggleFullscreen() {
                if (isFullscreen) {
                    closeFullscreen();
                } else {
                    openFullscreen();
                }
            }
            
            function openFullscreen() {
                if (imageList.length === 0) return;
                
                isFullscreen = true;
                
                // Create fullscreen element
                fullscreenElement = document.createElement('div');
                fullscreenElement.className = 'fullscreen';
                
                // Create image element
                const fullscreenImg = document.createElement('img');
                fullscreenImg.src = displayedImage.src;
                fullscreenElement.appendChild(fullscreenImg);
                
                // Create controls
                const controls = document.createElement('div');
                controls.className = 'fullscreen-controls';
                
                const prevBtn = document.createElement('button');
                prevBtn.textContent = 'Previous';
                prevBtn.addEventListener('click', prevImage);
                
                const nextBtn = document.createElement('button');
                nextBtn.textContent = 'Next';
                nextBtn.addEventListener('click', nextImage);
                
                const closeBtn = document.createElement('button');
                closeBtn.textContent = 'Close';
                closeBtn.addEventListener('click', closeFullscreen);
                
                controls.appendChild(prevBtn);
                controls.appendChild(nextBtn);
                controls.appendChild(closeBtn);
                fullscreenElement.appendChild(controls);
                
                // Add to document
                document.body.appendChild(fullscreenElement);
                
                // Update image when changed
                const observer = new MutationObserver(() => {
                    fullscreenImg.src = displayedImage.src;
                });
                
                observer.observe(displayedImage, { attributes: true, attributeFilter: ['src'] });
            }
            
            function closeFullscreen() {
                if (!isFullscreen) return;
                
                isFullscreen = false;
                document.body.removeChild(fullscreenElement);
            }
            
            // Handle keyboard navigation
            document.addEventListener('keydown', function(e) {
                if (isFullscreen) {
                    if (e.key === 'Escape') {
                        closeFullscreen();
                    } else if (e.key === 'ArrowLeft') {
                        prevImage();
                    } else if (e.key === 'ArrowRight') {
                        nextImage();
                    }
                } else {
                    if (e.key === 'ArrowLeft') {
                        prevImage();
                    } else if (e.key === 'ArrowRight') {
                        nextImage();
                    } else if (e.key === '+') {
                        zoomIn();
                    } else if (e.key === '-') {
                        zoomOut();
                    } else if (e.key === 'f') {
                        toggleFullscreen();
                    } else if (e.key === 's') {
                        if (slideshowActive) {
                            stopSlideshow();
                        } else {
                            startSlideshow();
                        }
                    }
                }
            });
        });