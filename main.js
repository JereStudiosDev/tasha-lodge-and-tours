/**
 * Tasha Lodge & Tours - Main JavaScript
 * Handles Global Navigation, Scroll Reveals, Modals, Gallery Filters, Lightbox, and WhatsApp Deep Linking
 */

// Phone Number Constant
const PHONE_NUMBER = "260972465150";

/**
 * WhatsApp Deep Linking
 */
function openWhatsApp(message) {
    const encoded = encodeURIComponent(message || 'Hi Tasha Lodge, I would like to make an inquiry.');
    const url = `https://wa.me/${PHONE_NUMBER}?text=${encoded}`;
    window.open(url, '_blank');
}

/**
 * Copy to Clipboard with Visual Toast Feedback
 */
function copyToClipboard(text, customMessage) {
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(() => {
            showToast(customMessage || 'Account details copied!');
        }).catch(() => {
            fallbackCopy(text, customMessage);
        });
    } else {
        fallbackCopy(text, customMessage);
    }
}

function fallbackCopy(text, customMessage) {
    const tempInput = document.createElement('input');
    tempInput.value = text;
    tempInput.style.position = 'fixed';
    tempInput.style.opacity = '0';
    document.body.appendChild(tempInput);
    tempInput.select();
    try {
        document.execCommand('copy');
        showToast(customMessage || 'Account details copied!');
    } catch (e) {
        showToast('Please copy manually: ' + text);
    }
    document.body.removeChild(tempInput);
}

/**
 * Toast Notification Banner
 */
function showToast(message) {
    let toast = document.getElementById('toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        toast.className = 'toast';
        document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('visible');

    if (window.toastTimeout) {
        clearTimeout(window.toastTimeout);
    }

    window.toastTimeout = setTimeout(() => {
        toast.classList.remove('visible');
    }, 2800);
}

/**
 * 2-Option Availability Modal Engine
 */
function openAvailabilityModal(roomName, priceInfo) {
    const modal = document.getElementById('availability-modal');
    if (!modal) return;

    const titleEl = document.getElementById('modal-room-title');
    const subtitleEl = document.getElementById('modal-room-subtitle');
    const waBtn = document.getElementById('modal-whatsapp-btn');
    const callBtn = document.getElementById('modal-call-btn');

    const cleanRoomName = roomName || 'Room Booking';
    if (titleEl) {
        titleEl.textContent = `Check Availability - ${cleanRoomName}`;
    }
    if (subtitleEl) {
        subtitleEl.textContent = priceInfo ? `Direct Rate: ${priceInfo}` : 'Inquire for instant availability and direct rates';
    }

    if (waBtn) {
        const waText = encodeURIComponent(`Hi Tasha Lodge, I would like to check availability for the ${cleanRoomName}.`);
        waBtn.href = `https://wa.me/${PHONE_NUMBER}?text=${waText}`;
    }

    if (callBtn) {
        callBtn.href = `tel:+${PHONE_NUMBER}`;
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeAvailabilityModal() {
    const modal = document.getElementById('availability-modal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

/**
 * Concept Booking Engine with Select Payment Options (Airtel, MTN, Zamtel, Card)
 * Non-working show-of-concept interactive prototype
 */
let currentPaymentMethod = 'airtel';

function openConceptBookingModal(itemName, itemPrice) {
    const modal = document.getElementById('concept-booking-modal');
    if (!modal) return;

    const selectEl = document.getElementById('concept-item-select');
    if (selectEl && itemName) {
        // If an option matches, select it, otherwise add or match
        for (let i = 0; i < selectEl.options.length; i++) {
            if (selectEl.options[i].text.toLowerCase().includes(itemName.toLowerCase())) {
                selectEl.selectedIndex = i;
                break;
            }
        }
    }

    // Reset view
    const formBox = document.getElementById('concept-form-container');
    const successBox = document.getElementById('concept-success-screen');
    const submitBtn = document.getElementById('concept-submit-btn');

    if (formBox) formBox.style.display = 'block';
    if (successBox) successBox.style.display = 'none';
    if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Simulate Payment & Reserve';
    }

    // Default payment method
    selectPaymentOption('airtel');
    calculateConceptTotal();

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeConceptBookingModal() {
    const modal = document.getElementById('concept-booking-modal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function selectPaymentOption(method) {
    currentPaymentMethod = method;

    // Update selected card styling
    const cards = document.querySelectorAll('.payment-option-card');
    cards.forEach(card => {
        if (card.getAttribute('data-method') === method) {
            card.classList.add('selected');
        } else {
            card.classList.remove('selected');
        }
    });

    // Update conditional fields
    const mobilePanel = document.getElementById('concept-mobile-panel');
    const cardPanel = document.getElementById('concept-card-panel');
    const mobileLabel = document.getElementById('concept-mobile-label');
    const mobilePrompt = document.getElementById('concept-mobile-prompt');
    const mobileInput = document.getElementById('concept-mobile-number');

    if (method === 'card') {
        if (mobilePanel) mobilePanel.style.display = 'none';
        if (cardPanel) cardPanel.style.display = 'block';
    } else {
        if (mobilePanel) mobilePanel.style.display = 'block';
        if (cardPanel) cardPanel.style.display = 'none';

        if (method === 'airtel') {
            if (mobileLabel) mobileLabel.textContent = 'Airtel Money Phone Number';
            if (mobilePrompt) mobilePrompt.textContent = 'A simulated Airtel Money USSD prompt will be sent to your Airtel SIM upon confirmation.';
            if (mobileInput) mobileInput.placeholder = '+260 97X XXX XXX';
        } else if (method === 'mtn') {
            if (mobileLabel) mobileLabel.textContent = 'MTN Mobile Money Phone Number';
            if (mobilePrompt) mobilePrompt.textContent = 'A simulated MTN MoMo PIN authorization prompt will be pushed to your device.';
            if (mobileInput) mobileInput.placeholder = '+260 96X XXX XXX';
        } else if (method === 'zamtel') {
            if (mobileLabel) mobileLabel.textContent = 'Zamtel Kwacha Phone Number';
            if (mobilePrompt) mobilePrompt.textContent = 'A simulated Zamtel Kwacha payment request will be sent to your registered number.';
            if (mobileInput) mobileInput.placeholder = '+260 95X XXX XXX';
        }
    }
}

function calculateConceptTotal() {
    const selectEl = document.getElementById('concept-item-select');
    const nightsEl = document.getElementById('concept-nights-input');
    const totalEl = document.getElementById('concept-total-display');
    const subtotalEl = document.getElementById('concept-subtotal-display');

    if (!selectEl) return;

    const basePrice = parseInt(selectEl.options[selectEl.selectedIndex].getAttribute('data-price') || '85', 10);
    const nights = nightsEl ? parseInt(nightsEl.value || '1', 10) : 1;
    const subtotal = basePrice * nights;
    const total = subtotal; // Inclusive of taxes & levies

    if (subtotalEl) subtotalEl.textContent = `$${subtotal} USD`;
    if (totalEl) totalEl.textContent = `$${total} USD (~ZMW ${(total * 27.5).toLocaleString()})`;
}

function submitConceptBooking(event) {
    if (event) event.preventDefault();

    const submitBtn = document.getElementById('concept-submit-btn');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
            <svg style="animation: spin 1s linear infinite; display: inline-block; width: 16px; height: 16px; vertical-align: middle; margin-right: 8px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
                <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"></path>
            </svg>
            Processing with ${currentPaymentMethod.toUpperCase()}...
        `;
    }

    setTimeout(() => {
        const formBox = document.getElementById('concept-form-container');
        const successBox = document.getElementById('concept-success-screen');
        const selectEl = document.getElementById('concept-item-select');
        const nameInput = document.getElementById('concept-name-input');
        const nightsInput = document.getElementById('concept-nights-input');
        const dateInput = document.getElementById('concept-date-input');

        const successItem = document.getElementById('success-summary-item');
        const successMethod = document.getElementById('success-summary-method');
        const successName = document.getElementById('success-summary-name');
        const successDates = document.getElementById('success-summary-dates');

        const itemName = selectEl ? selectEl.options[selectEl.selectedIndex].text : 'Executive Suite';
        const guestName = (nameInput && nameInput.value.trim()) ? nameInput.value.trim() : 'Guest';
        const travelDates = (dateInput && dateInput.value) ? dateInput.value : 'Upcoming Season';
        const nights = nightsInput ? nightsInput.value : '1';

        let methodLabel = 'Airtel Money';
        if (currentPaymentMethod === 'mtn') methodLabel = 'MTN Mobile Money';
        if (currentPaymentMethod === 'zamtel') methodLabel = 'Zamtel Kwacha';
        if (currentPaymentMethod === 'card') methodLabel = 'Credit/Debit Card (Visa/Mastercard)';

        if (successItem) successItem.textContent = itemName;
        if (successMethod) successMethod.textContent = methodLabel;
        if (successName) successName.textContent = guestName;
        if (successDates) successDates.textContent = `${travelDates} (${nights} Night/Session)`;

        // Setup WhatsApp fallback button inside confirmation
        const waSuccessBtn = document.getElementById('success-whatsapp-btn');
        if (waSuccessBtn) {
            const waMsg = encodeURIComponent(`Hi Tasha Lodge, I would like to finalize my booking for ${itemName} on ${travelDates} under ${guestName}. Preferred payment: ${methodLabel}.`);
            waSuccessBtn.href = `https://wa.me/${PHONE_NUMBER}?text=${waMsg}`;
        }

        if (formBox) formBox.style.display = 'none';
        if (successBox) successBox.style.display = 'block';
    }, 1200);
}

/**
 * Gallery Filter and Lightbox Engine
 */
let currentGalleryItems = [];
let currentLightboxIndex = 0;

function initGallery() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox-modal');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');
    const lightboxClose = document.getElementById('lightbox-close');

    if (!galleryItems.length) return;

    // Build list of active items
    function updateVisibleItems(filterCategory) {
        currentGalleryItems = [];
        galleryItems.forEach(item => {
            const itemCat = item.getAttribute('data-category');
            if (filterCategory === 'all' || itemCat === filterCategory) {
                item.style.display = 'block';
                currentGalleryItems.push(item);
                // Trigger reflow & fade in
                requestAnimationFrame(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0) scale(1)';
                });
            } else {
                item.style.opacity = '0';
                item.style.transform = 'translateY(10px) scale(0.97)';
                setTimeout(() => {
                    if (item.style.opacity === '0') {
                        item.style.display = 'none';
                    }
                }, 250);
            }
        });
    }

    // Filter Button Clicks
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const category = btn.getAttribute('data-filter') || 'all';
            updateVisibleItems(category);
        });
    });

    // Initial population
    updateVisibleItems('all');

    // Lightbox open function
    function showLightbox(index) {
        if (!lightbox || !currentGalleryItems.length) return;
        currentLightboxIndex = (index + currentGalleryItems.length) % currentGalleryItems.length;
        const targetItem = currentGalleryItems[currentLightboxIndex];
        const img = targetItem.querySelector('img');
        const captionText = targetItem.querySelector('.gallery-caption') ? targetItem.querySelector('.gallery-caption').textContent : img.alt;

        if (lightboxImg) {
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
        }
        if (lightboxCaption) {
            lightboxCaption.textContent = captionText;
        }

        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        if (lightbox) {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    // Attach click to items
    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const index = currentGalleryItems.indexOf(item);
            if (index !== -1) {
                showLightbox(index);
            }
        });
    });

    // Navigation triggers
    if (lightboxPrev) {
        lightboxPrev.addEventListener('click', (e) => {
            e.stopPropagation();
            showLightbox(currentLightboxIndex - 1);
        });
    }

    if (lightboxNext) {
        lightboxNext.addEventListener('click', (e) => {
            e.stopPropagation();
            showLightbox(currentLightboxIndex + 1);
        });
    }

    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }

    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }

    // Keyboard support
    document.addEventListener('keydown', (e) => {
        if (lightbox && lightbox.classList.contains('active')) {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') showLightbox(currentLightboxIndex - 1);
            if (e.key === 'ArrowRight') showLightbox(currentLightboxIndex + 1);
        }
    });
}

/**
 * DOM Ready Initializations
 */
document.addEventListener('DOMContentLoaded', () => {
    // 1. Highlight Active Nav Links based on current file
    const currentPath = window.location.pathname;
    const pageName = currentPath.substring(currentPath.lastIndexOf('/') + 1) || 'index.html';

    const navLinks = document.querySelectorAll('.desktop-nav a, .bottom-nav .nav-item');
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href) {
            const linkPage = href.substring(href.lastIndexOf('/') + 1);
            if (linkPage === pageName || (pageName === '' && linkPage === 'index.html')) {
                link.classList.add('active');
            }
        }
    });

    // 2. IntersectionObserver for Smooth Scroll-Driven Reveal
    const revealElements = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.08,
            rootMargin: '0px 0px -40px 0px'
        });

        revealElements.forEach(el => revealObserver.observe(el));
    } else {
        // Fallback for older browsers
        revealElements.forEach(el => el.classList.add('visible'));
    }

    // 3. Modal close on backdrop click & Escape key
    const availModal = document.getElementById('availability-modal');
    if (availModal) {
        availModal.addEventListener('click', (e) => {
            if (e.target === availModal) {
                closeAvailabilityModal();
            }
        });
    }

    const conceptModal = document.getElementById('concept-booking-modal');
    if (conceptModal) {
        conceptModal.addEventListener('click', (e) => {
            if (e.target === conceptModal) {
                closeConceptBookingModal();
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeAvailabilityModal();
            closeConceptBookingModal();
        }
    });

    // Dynamic price calculation listeners
    const selectItem = document.getElementById('concept-item-select');
    if (selectItem) {
        selectItem.addEventListener('change', calculateConceptTotal);
    }
    const nightsInput = document.getElementById('concept-nights-input');
    if (nightsInput) {
        nightsInput.addEventListener('input', calculateConceptTotal);
    }

    // 4. Initialize Gallery (if on gallery page)
    initGallery();
});
