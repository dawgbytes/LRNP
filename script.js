// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }));
}

// Smooth scrolling for anchor links
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

// Form handling
function handleContactForm(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    // Show loading state
    submitBtn.innerHTML = '<span class="loading"></span> Sending...';
    submitBtn.disabled = true;
    
    // Get form data
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        inquiry_type: formData.get('inquiry_type'),
        plant_interest: formData.get('plant_interest'),
        project_details: formData.get('project_details'),
        budget_range: formData.get('budget_range'),
        timeline: formData.get('timeline'),
        message: formData.get('message'),
        preferred_contact: formData.get('preferred_contact'),
        newsletter_signup: formData.get('newsletter_signup') ? 'Yes' : 'No'
    };
    
    // Create email content for QuickBooks compatibility
    const emailContent = createQuickBooksCompatibleEmail(data);
    
    // Simulate form submission (replace with actual form handling)
    setTimeout(() => {
        // Create mailto link with formatted content
        const subject = encodeURIComponent(`${data.inquiry_type} - ${data.name}`);
        const body = encodeURIComponent(emailContent);
        const mailtoLink = `mailto:sales@ncnativeplants.com?subject=${subject}&body=${body}`;
        
        // Open email client
        window.location.href = mailtoLink;
        
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // Show success message
        showMessage('Thank you! Your email client should open with a pre-filled message. Please send it to complete your request.', 'success');
        
    }, 2000);
}

// Create QuickBooks-compatible email format
function createQuickBooksCompatibleEmail(data) {
    const timestamp = new Date().toLocaleString();
    
    return `
LUMBER RIVER NATIVE PLANTS - INQUIRY FORM
Generated: ${timestamp}

=== CUSTOMER INFORMATION ===
Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone}
Preferred Contact Method: ${data.preferred_contact}

=== INQUIRY DETAILS ===
Inquiry Type: ${data.inquiry_type}
Plant Interest: ${data.plant_interest}
Project Details: ${data.project_details}
Budget Range: ${data.budget_range}
Timeline: ${data.timeline}

=== MESSAGE ===
${data.message}

=== ADDITIONAL INFO ===
Newsletter Signup: ${data.newsletter_signup}

---
This inquiry was generated from the Lumber River Native Plants website contact form.
For QuickBooks integration, this data can be copied directly into a customer record.

CONTACT INFORMATION:
Jep Whitlock, Owner
Lumber River Native Plants
7000 Livingston Rd, Gibson, NC 28343
Phone: (336) 601-8787
Email: sales@ncnativeplants.com
Website: lumberrivernativeplants.com
`;
}

// Plant filter functionality
function filterPlants(category) {
    const plants = document.querySelectorAll('.plant-card, .plant-detail-card');
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    // Update active filter button
    filterButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent.toLowerCase() === category.toLowerCase() || 
            btn.textContent.toLowerCase() === 'all') {
            if (category === 'all' && btn.textContent.toLowerCase() === 'all') {
                btn.classList.add('active');
            } else if (category !== 'all' && btn.textContent.toLowerCase() === category.toLowerCase()) {
                btn.classList.add('active');
            }
        }
    });
    
    // Filter plants
    plants.forEach(plant => {
        if (category === 'all') {
            plant.style.display = 'block';
        } else {
            const plantCategory = plant.dataset.category;
            if (plantCategory && plantCategory.toLowerCase().includes(category.toLowerCase())) {
                plant.style.display = 'block';
            } else {
                plant.style.display = 'none';
            }
        }
    });
}

// Show message function
function showMessage(message, type = 'info') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    
    const form = document.querySelector('.form-container');
    if (form) {
        form.insertBefore(messageDiv, form.firstChild);
        
        // Remove message after 5 seconds
        setTimeout(() => {
            messageDiv.remove();
        }, 5000);
    }
}

// Merchandise quantity handlers
function updateQuantity(productId, change) {
    const quantityInput = document.querySelector(`#quantity-${productId}`);
    if (quantityInput) {
        let currentQuantity = parseInt(quantityInput.value) || 1;
        let newQuantity = currentQuantity + change;
        
        if (newQuantity < 1) newQuantity = 1;
        if (newQuantity > 99) newQuantity = 99;
        
        quantityInput.value = newQuantity;
        updateTotal(productId);
    }
}

function updateTotal(productId) {
    const quantityInput = document.querySelector(`#quantity-${productId}`);
    const priceElement = document.querySelector(`#price-${productId}`);
    const totalElement = document.querySelector(`#total-${productId}`);
    
    if (quantityInput && priceElement && totalElement) {
        const quantity = parseInt(quantityInput.value) || 1;
        const price = parseFloat(priceElement.dataset.price);
        const total = quantity * price;
        
        totalElement.textContent = `$${total.toFixed(2)}`;
    }
}

// Initialize page functionality
document.addEventListener('DOMContentLoaded', function() {
    // Add form event listeners
    const contactForm = document.querySelector('#contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }
    
    // Add filter button event listeners
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const category = this.textContent.toLowerCase();
            filterPlants(category === 'all' ? 'all' : category);
        });
    });
    
    // Initialize quantity inputs
    document.querySelectorAll('.quantity-input').forEach(input => {
        const productId = input.id.replace('quantity-', '');
        updateTotal(productId);
    });
    
    // Add smooth reveal animation for cards
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe all cards for animation
    document.querySelectorAll('.plant-card, .service-card, .merchandise-item').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });

    // Ensure Seeds link is present in nav
    document.querySelectorAll('.nav-menu').forEach(function(menu){
        var hasSeeds = Array.from(menu.querySelectorAll('a')).some(function(a){ return a.getAttribute('href') === 'seeds.html'; });
        if(!hasSeeds){
            var li = document.createElement('li');
            li.className = 'nav-item';
            var a = document.createElement('a');
            a.className = 'nav-link';
            a.href = 'seeds.html';
            a.textContent = 'Seeds';
            li.appendChild(a);
            var contactItem = menu.querySelector('a[href="contact.html"]').closest('li');
            if(contactItem){
                menu.insertBefore(li, contactItem);
            } else {
                menu.appendChild(li);
            }
        }
    });
});

// Print-on-demand integration
function redirectToPOD(productType) {
    const baseUrl = 'https://printify.com/app/products';
    const productUrls = {
        't-shirt': `${baseUrl}/t-shirts`,
        'mug': `${baseUrl}/mugs`,
        'tote-bag': `${baseUrl}/tote-bags`,
        'sticker': `${baseUrl}/stickers`,
        'poster': `${baseUrl}/posters`
    };
    
    if (productUrls[productType]) {
        window.open(productUrls[productType], '_blank');
    }
}

// Newsletter signup
function handleNewsletterSignup(event) {
    event.preventDefault();
    
    const email = document.querySelector('#newsletter-email').value;
    if (email) {
        // Create mailto for newsletter signup
        const subject = encodeURIComponent('Newsletter Signup Request');
        const body = encodeURIComponent(`Please add this email to your newsletter list: ${email}`);
        const mailtoLink = `mailto:sales@ncnativeplants.com?subject=${subject}&body=${body}`;
        
        window.location.href = mailtoLink;
        
        showMessage('Thank you for signing up! Your email client will open to complete the signup.', 'success');
    }
}

// Google Analytics integration (placeholder)
function trackEvent(action, category, label) {
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            event_category: category,
            event_label: label
        });
    }
}

// Track form submissions
document.addEventListener('submit', function(event) {
    if (event.target.id === 'contact-form') {
        trackEvent('form_submit', 'contact', 'contact_form');
    }
    if (event.target.id === 'newsletter-form') {
        trackEvent('newsletter_signup', 'engagement', 'newsletter');
    }
});

// Track button clicks
document.addEventListener('click', function(event) {
    if (event.target.classList.contains('btn-primary')) {
        const buttonText = event.target.textContent.trim();
        trackEvent('button_click', 'engagement', buttonText);
    }
});
