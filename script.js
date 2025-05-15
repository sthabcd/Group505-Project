document.addEventListener('DOMContentLoaded', function() {
      const carousel = document.getElementById('productCarousel');
    const items = document.querySelectorAll('.carousel-item');
    const prevBtn = document.querySelector('.carousel-control.prev');
    const nextBtn = document.querySelector('.carousel-control.next');
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    
  
    const originalProducts = Array.from(items).map(item => {
        return {
            element: item,
            name: item.querySelector('h3').textContent.toLowerCase(),
            price: item.querySelector('p').textContent
        };
    });
    
  
    const cloneCount = 3; 
    for (let i = 0; i < cloneCount; i++) {
        items.forEach(item => {
            carousel.appendChild(item.cloneNode(true));
            carousel.insertBefore(item.cloneNode(true), carousel.firstChild);
        });
    }
    
    let allItems = document.querySelectorAll('.carousel-item');
    const itemCount = items.length;
    let currentIndex = cloneCount * itemCount; 
    let isTransitioning = false;
    let intervalId;
    

    function setupCarousel() {
        const itemWidth = items[0].offsetWidth + 30; 
        carousel.style.width = `${itemWidth * allItems.length}px`;
        moveToIndex(currentIndex, false);
    }
    

    function moveToIndex(index, withAnimation = true) {
        if (isTransitioning) return;
        isTransitioning = true;
        currentIndex = index;
        
        const itemWidth = items[0].offsetWidth + 30;
        const newPosition = -currentIndex * itemWidth;
        
        carousel.style.transition = withAnimation ? 'transform 0.5s ease-in-out' : 'none';
        carousel.style.transform = `translateX(${newPosition}px)`;
        
        if (withAnimation) {
            const handleTransitionEnd = () => {
                carousel.removeEventListener('transitionend', handleTransitionEnd);
                
            
                if (currentIndex <= itemCount) {
                    currentIndex = cloneCount * itemCount + (currentIndex % itemCount);
                    moveToIndex(currentIndex, false);
                } else if (currentIndex >= (cloneCount * 2 - 1) * itemCount) {
                    currentIndex = cloneCount * itemCount + (currentIndex % itemCount);
                    moveToIndex(currentIndex, false);
                }
                
                isTransitioning = false;
            };
            carousel.addEventListener('transitionend', handleTransitionEnd);
        } else {
            isTransitioning = false;
        }
    }
    
  
    function nextSlide() { moveToIndex(currentIndex + 1); }
    function prevSlide() { moveToIndex(currentIndex - 1); }
    
    
    function startAutoSlide() { intervalId = setInterval(nextSlide, 3000); }
    function stopAutoSlide() { clearInterval(intervalId); }
    

   function handleSearch() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    
    stopAutoSlide(); 
    
 
    carousel.innerHTML = '';
    
    if (searchTerm === '') {
  
        originalProducts.forEach(product => {
            product.element.style.display = 'block';
            carousel.appendChild(product.element);
        });
        
      
        allItems = document.querySelectorAll('.carousel-item');
        currentIndex = 0; 
        setupCarousel();
        startAutoSlide();
        return;
    }
    

    const filteredProducts = originalProducts.filter(product => 
        product.name.toLowerCase().includes(searchTerm)
    );
    
    if (filteredProducts.length === 0) {
      
        carousel.innerHTML = `
            <div class="no-results" style="width:100%; text-align:center; padding:20px;">
                No products found for "${searchTerm}"
            </div>
        `;
        prevBtn.style.display = 'none';
        nextBtn.style.display = 'none';
        return;
    }
    
 
    filteredProducts.forEach(product => {
        product.element.style.display = 'block';
        carousel.appendChild(product.element);
    });
    
   
    allItems = document.querySelectorAll('.carousel-item');
    currentIndex = 0;

    const itemWidth = allItems[0]?.offsetWidth + 30 || 0;
    carousel.style.width = `${itemWidth * filteredProducts.length}px`;
    carousel.style.transform = 'translateX(0)';
    
   
    // if (filteredProducts.length <= 1) {
    //     prevBtn.style.display = 'none';
    //     nextBtn.style.display = 'none';
    // } else {
    //     prevBtn.style.display = 'block';
    //     nextBtn.style.display = 'block';
    //     startAutoSlide(); // 只有多个项目时恢复自动轮播
    // }
}
    

    setupCarousel();
    startAutoSlide();
    

    nextBtn.addEventListener('click', () => { stopAutoSlide(); nextSlide(); startAutoSlide(); });
    prevBtn.addEventListener('click', () => { stopAutoSlide(); prevSlide(); startAutoSlide(); });
    carousel.addEventListener('mouseenter', stopAutoSlide);
    carousel.addEventListener('mouseleave', startAutoSlide);
    window.addEventListener('resize', () => { setupCarousel(); moveToIndex(currentIndex, false); });
    
    
    searchButton.addEventListener('click', handleSearch);
    searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') handleSearch();
    });
    

    const addToCartButtons = document.querySelectorAll('.btn-add-to-cart');
    const cartCount = document.querySelector('.cart-count');
    const modal = document.getElementById('addToCartModal');
    const closeModal = document.querySelector('.close-modal');
    const continueShopping = document.querySelector('.btn-continue');
    const viewCart = document.querySelector('.btn-view-cart');

    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            const currentCount = parseInt(cartCount.textContent);
            cartCount.textContent = currentCount + 1;
            
       
            modal.style.display = 'flex';
        });
    });

    function closeAddToCartModal() {
        modal.style.display = 'none';
    }

    closeModal.addEventListener('click', closeAddToCartModal);
    continueShopping.addEventListener('click', closeAddToCartModal);
    viewCart.addEventListener('click', () => {
        closeAddToCartModal();
        window.location.href = '#cart';
    });

  
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeAddToCartModal();
        }
    });

 
    const newsletterForm = document.getElementById('newsletterForm');

    newsletterForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        let valid = true;
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const interestsInput = document.getElementById('interests');
        
    
        resetFormValidation();
        
 
        if (nameInput.value.trim() === '') {
            showError(nameInput, 'Name is required');
            valid = false;
        }
        
   
        if (emailInput.value.trim() === '') {
            showError(emailInput, 'Email is required');
            valid = false;
        } else if (!isValidEmail(emailInput.value)) {
            showError(emailInput, 'Please enter a valid email address');
            valid = false;
        }
        
    
        if (interestsInput.value === '') {
            showError(interestsInput, 'Please select your interests');
            valid = false;
        }
        
        if (valid) {
           
            alert('Thank you for subscribing to our newsletter!');
            newsletterForm.reset();
        }
    });


    function showError(inputElement, message) {
        const formGroup = inputElement.parentElement;
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        formGroup.appendChild(errorElement);
        inputElement.style.borderColor = 'red';
        inputElement.style.boxShadow = '0 0 0 2px rgba(255, 0, 0, 0.2)';
    }

    function resetFormValidation() {
        const errorElements = document.querySelectorAll('.error-message');
        errorElements.forEach(element => element.remove());
        
        const formInputs = [document.getElementById('name'), 
                           document.getElementById('email'), 
                           document.getElementById('interests')];
        
        formInputs.forEach(input => {
            input.style.borderColor = '';
            input.style.boxShadow = '';
        });
    }

  
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

  
    const formInputs = document.querySelectorAll('input, select, textarea');
    
    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.style.borderColor = 'var(--primary-color)';
            this.style.boxShadow = '0 0 0 2px rgba(76, 175, 80, 0.2)';
        });
        
        input.addEventListener('blur', function() {
            if (!this.classList.contains('error')) {
                this.style.borderColor = '';
                this.style.boxShadow = '';
            }
        });
    });

   
    const navToggle = document.createElement('button');
    navToggle.className = 'nav-toggle';
    navToggle.innerHTML = '<i class="fas fa-bars"></i>';
    navToggle.style.display = 'none';
    document.querySelector('header .container').prepend(navToggle);

   
    function handleResponsiveNavigation() {
        if (window.innerWidth <= 768) {
            navToggle.style.display = 'block';
            
            navToggle.addEventListener('click', function() {
                const nav = document.querySelector('nav');
                nav.classList.toggle('active');
                
                if (nav.classList.contains('active')) {
                    this.innerHTML = '<i class="fas fa-times"></i>';
                } else {
                    this.innerHTML = '<i class="fas fa-bars"></i>';
                }
            });
        } else {
            navToggle.style.display = 'none';
            document.querySelector('nav').classList.remove('active');
        }
    }

    handleResponsiveNavigation();
    window.addEventListener('resize', handleResponsiveNavigation);

    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                document.querySelector('nav').classList.remove('active');
                navToggle.innerHTML = '<i class="fas fa-bars"></i>';
            }
            
            const targetId = this.getAttribute('href');
            if (targetId.startsWith('#') && targetId.length > 1) {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 100,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });


    document.querySelectorAll('nav').forEach(nav => {
        nav.setAttribute('role', 'navigation');
    });
    
    document.querySelectorAll('button').forEach(button => {
        if (!button.hasAttribute('role')) {
            button.setAttribute('role', 'button');
        }
    });
    
    document.querySelectorAll('.carousel-container').forEach(carousel => {
        carousel.setAttribute('role', 'region');
        carousel.setAttribute('aria-label', 'Product Carousel');
    });
});


const additionalStyles = `
<style>
    .error-message {
        color: red;
        font-size: 0.8rem;
        margin-top: 5px;
    }
    
    .nav-toggle {
        background: none;
        border: none;
        font-size: 1.5rem;
        color: var(--text-color);
        cursor: pointer;
        display: none;
    }
    
    .nav-toggle:hover {
        color: var(--primary-color);
    }
    
    nav.active ul {
        display: flex;
        flex-direction: column;
        background-color: white;
        position: absolute;
        top: 100%;
        left: 0;
        width: 100%;
        box-shadow: var(--shadow);
        padding: 20px 0;
        z-index: 1000;
    }
    
    nav.active ul li {
        margin: 10px 0;
        text-align: center;
    }
</style>
`;

document.head.insertAdjacentHTML('beforeend', additionalStyles);
document.addEventListener('DOMContentLoaded', function() {
  
    let cart = [];
    const cartCount = document.querySelector('.cart-count');
    const cartIcon = document.querySelector('.cart-icon a');
    const viewCartButton = document.querySelector('.btn-view-cart');

 
    const cartModal = document.createElement('div');
    cartModal.className = 'cart-modal';
    cartModal.style.display = 'none';
    cartModal.style.position = 'fixed';
    cartModal.style.top = '0';
    cartModal.style.left = '0';
    cartModal.style.width = '100%';
    cartModal.style.height = '100%';
    cartModal.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    cartModal.style.zIndex = '1000';
    cartModal.style.justifyContent = 'center';
    cartModal.style.alignItems = 'center';

    const cartContent = document.createElement('div');
    cartContent.className = 'cart-content';
    cartContent.style.backgroundColor = 'white';
    cartContent.style.padding = '30px';
    cartContent.style.borderRadius = '10px';
    cartContent.style.maxWidth = '600px';
    cartContent.style.width = '90%';

    const cartTitle = document.createElement('h2');
    cartTitle.textContent = 'Your Shopping Cart';
    cartTitle.style.textAlign = 'center';
    cartTitle.style.marginBottom = '20px';

    const cartItemsList = document.createElement('div');
    cartItemsList.id = 'cartItemsList';
    cartItemsList.style.marginBottom = '20px';

    const cartTotal = document.createElement('div');
    cartTotal.id = 'cartTotal';
    cartTotal.style.fontWeight = 'bold';
    cartTotal.style.marginBottom = '20px';
    cartTotal.style.textAlign = 'right';

    const closeCartButton = document.createElement('button');
    closeCartButton.textContent = 'Close';
    closeCartButton.style.display = 'block';
    closeCartButton.style.margin = '0 auto';
    closeCartButton.style.padding = '10px 20px';
    closeCartButton.style.backgroundColor = '#ccc';
    closeCartButton.style.border = 'none';
    closeCartButton.style.borderRadius = '5px';
    closeCartButton.style.cursor = 'pointer';

    cartContent.appendChild(cartTitle);
    cartContent.appendChild(cartItemsList);
    cartContent.appendChild(cartTotal);
    cartContent.appendChild(closeCartButton);
    cartModal.appendChild(cartContent);
    document.body.appendChild(cartModal);

    const addToCartButtons = document.querySelectorAll('.btn-add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            const productName = button.parentElement.querySelector('h3').textContent;
            const productPrice = parseFloat(button.parentElement.querySelector('p').textContent.replace('$', ''));
            
            cart.push({ name: productName, price: productPrice });
            
            cartCount.textContent = cart.length;
            
          
            alert(`${productName} has been added to your cart!`);
        });
    });

  
    function showCart() {
        cartModal.style.display = 'flex';
        
   
        cartItemsList.innerHTML = '';
        
 
        if (cart.length === 0) {
            cartItemsList.innerHTML = '<p>Your cart is empty.</p>';
            cartTotal.textContent = 'Total: $0.00';
            return;
        }

        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.style.display = 'flex';
            cartItem.style.justifyContent = 'space-between';
            cartItem.style.marginBottom = '10px';
            cartItem.style.padding = '10px';
            cartItem.style.border = '1px solid #ddd';
            
            const itemName = document.createElement('span');
            itemName.textContent = item.name;
            
            const itemPrice = document.createElement('span');
            itemPrice.textContent = `$${item.price.toFixed(2)}`;
            
            cartItem.appendChild(itemName);
            cartItem.appendChild(itemPrice);
            cartItemsList.appendChild(cartItem);
        });
        
 
        const total = cart.reduce((sum, item) => sum + item.price, 0);
 
        const vueDiscount = cartCouponVue ? cartCouponVue.discount : 0;
        const finalTotal = total - vueDiscount;
        
        cartTotal.innerHTML = `
          <div>Total: $${total.toFixed(2)}</div>
          <div class="discount">Discount: -$${vueDiscount.toFixed(2)}</div>
          <div class="final-total">Final Total: $${finalTotal.toFixed(2)}</div>`;
    }


    cartIcon.addEventListener('click', (e) => {
        e.preventDefault();
        showCart();
    });

    viewCartButton.addEventListener('click', showCart);


    closeCartButton.addEventListener('click', () => {
        cartModal.style.display = 'none';
    });


    cartModal.addEventListener('click', (e) => {
        if (e.target === cartModal) {
            cartModal.style.display = 'none';
        }
    });

    const SubmitButton = document.createElement('button');
    SubmitButton.textContent = 'Submit';
    SubmitButton.style.display = 'inline-block';
    SubmitButton.style.margin = '0 10px';
    SubmitButton.style.padding = '10px 20px';
    SubmitButton.style.backgroundColor = '#4CAF50'; 
    SubmitButton.style.color = 'white';
    SubmitButton.style.border = 'none';
    SubmitButton.style.borderRadius = '5px';
    SubmitButton.style.cursor = 'pointer';

  
    closeCartButton.style.display = 'inline-block';
    closeCartButton.style.margin = '0 10px';

    const buttonContainer = document.createElement('div');
    buttonContainer.style.textAlign = 'center';
    buttonContainer.appendChild(closeCartButton);
    buttonContainer.appendChild(SubmitButton);
    cartContent.appendChild(buttonContainer); 

    const infoModal = document.createElement('div');
    infoModal.className = 'info-modal';
    infoModal.style.display = 'none';
    infoModal.style.position = 'fixed';
    infoModal.style.top = '0';
    infoModal.style.left = '0';
    infoModal.style.width = '100%';
    infoModal.style.height = '100%';
    infoModal.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    infoModal.style.zIndex = '1000';
    infoModal.style.justifyContent = 'center';
    infoModal.style.alignItems = 'center';

    const infoContent = document.createElement('div');
    infoContent.className = 'info-content';
    infoContent.style.backgroundColor = 'white';
    infoContent.style.padding = '30px';
    infoContent.style.borderRadius = '10px';
    infoContent.style.maxWidth = '500px';
    infoContent.style.width = '90%';

    const infoTitle = document.createElement('h2');
    infoTitle.textContent = 'Shipping Information';
    infoTitle.style.textAlign = 'center';
    infoTitle.style.marginBottom = '20px';


    const infoForm = document.createElement('form');
    infoForm.style.display = 'flex';
    infoForm.style.flexDirection = 'column';
    infoForm.style.gap = '15px';


    const fields = [
        { label: 'Full Name', type: 'text', id: 'name', required: true },
        { label: 'Phone Number', type: 'tel', id: 'phone', required: true },
        { label: 'Address', type: 'text', id: 'address', required: true },
        { label: 'Email', type: 'email', id: 'email', required: true },
    ];

    fields.forEach(field => {
        const label = document.createElement('label');
        label.textContent = field.label;
        label.style.fontWeight = 'bold';

        const input = document.createElement('input');
        input.type = field.type;
        input.id = field.id;
        input.required = field.required;
        input.style.padding = '8px';
        input.style.border = '1px solid #ddd';
        input.style.borderRadius = '4px';

        const div = document.createElement('div');
        div.appendChild(label);
        div.appendChild(input);
        infoForm.appendChild(div);
    });


    const submitButton = document.createElement('button');
    submitButton.textContent = 'Submit Order';
    submitButton.style.padding = '10px';
    submitButton.style.backgroundColor = '#4CAF50';
    submitButton.style.color = 'white';
    submitButton.style.border = 'none';
    submitButton.style.borderRadius = '5px';
    submitButton.style.cursor = 'pointer';

    const closeInfoButton = document.createElement('button');
    closeInfoButton.textContent = 'Close';
    closeInfoButton.style.marginTop = '10px';
    closeInfoButton.style.padding = '10px';
    closeInfoButton.style.backgroundColor = '#ccc';
    closeInfoButton.style.border = 'none';
    closeInfoButton.style.borderRadius = '5px';
    closeInfoButton.style.cursor = 'pointer';

    infoForm.appendChild(submitButton);
    infoContent.appendChild(infoTitle);
    infoContent.appendChild(infoForm);
    infoContent.appendChild(closeInfoButton);
    infoModal.appendChild(infoContent);
    document.body.appendChild(infoModal);

   
    SubmitButton.addEventListener('click', () => {
        infoModal.style.display = 'flex';
    });


    closeInfoButton.addEventListener('click', (e) => {
        e.preventDefault();
        infoModal.style.display = 'none';
    });


    infoModal.addEventListener('click', (e) => {
        if (e.target === infoModal) {
            infoModal.style.display = 'none';
        }
    });

 
    infoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const phone = document.getElementById('phone').value;
        const address = document.getElementById('address').value;
        const email = document.getElementById('email').value;

       
     
        cart = [];
        cartCount.textContent = '0';
        
    
        cartModal.style.display = 'none';
        infoModal.style.display = 'none';
    });

        
    const adviceLink = document.querySelector('a[href="#advice"]');


    const adviceModal = document.createElement('div');
    adviceModal.className = 'advice-modal';
    adviceModal.style.display = 'none';
    adviceModal.style.position = 'fixed';
    adviceModal.style.top = '0';
    adviceModal.style.left = '0';
    adviceModal.style.width = '100%';
    adviceModal.style.height = '100%';
    adviceModal.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    adviceModal.style.zIndex = '1000';
    adviceModal.style.justifyContent = 'center';
    adviceModal.style.alignItems = 'center';

    const adviceContent = document.createElement('div');
    adviceContent.className = 'advice-content';
    adviceContent.style.backgroundColor = 'white';
    adviceContent.style.padding = '30px';
    adviceContent.style.borderRadius = '10px';
    adviceContent.style.maxWidth = '500px';
    adviceContent.style.width = '90%';

    const adviceTitle = document.createElement('h2');
    adviceTitle.textContent = 'Your Feedback';
    adviceTitle.style.textAlign = 'center';
    adviceTitle.style.marginBottom = '20px';

   
    const adviceForm = document.createElement('form');
    adviceForm.style.display = 'flex';
    adviceForm.style.flexDirection = 'column';
    adviceForm.style.gap = '15px';

 
    const fieldss = [
        { label: 'Your Phone (Optional)', type: 'text', id: 'advice-Phone' },
        { label: 'Your Name (Optional)', type: 'text', id: 'advice-name' },
        { label: 'Your Email (Optional)', type: 'email', id: 'advice-email' },
        { label: 'Your Advice / Feedback', type: 'textarea', id: 'advice-message', required: true },
    ];

    fieldss.forEach(field => {
        const label = document.createElement('label');
        label.textContent = field.label;
        label.style.fontWeight = 'bold';

        let input;
        if (field.type === 'textarea') {
            input = document.createElement('textarea');
            input.rows = 5;
            input.style.resize = 'vertical';
        } else {
            input = document.createElement('input');
            input.type = field.type;
        }
        input.id = field.id;
        input.required = field.required || false;
        input.style.padding = '8px';
        input.style.border = '1px solid #ddd';
        input.style.borderRadius = '4px';

        const div = document.createElement('div');
        div.appendChild(label);
        div.appendChild(input);
        adviceForm.appendChild(div);
    });


    const submitAdviceButton = document.createElement('button');
    submitAdviceButton.textContent = 'Submit Feedback';
    submitAdviceButton.style.padding = '10px';
    submitAdviceButton.style.backgroundColor = '#4CAF50';
    submitAdviceButton.style.color = 'white';
    submitAdviceButton.style.border = 'none';
    submitAdviceButton.style.borderRadius = '5px';
    submitAdviceButton.style.cursor = 'pointer';

    const closeAdviceButton = document.createElement('button');
    closeAdviceButton.textContent = 'Close';
    closeAdviceButton.style.marginTop = '10px';
    closeAdviceButton.style.padding = '10px';
    closeAdviceButton.style.backgroundColor = '#ccc';
    closeAdviceButton.style.border = 'none';
    closeAdviceButton.style.borderRadius = '5px';
    closeAdviceButton.style.cursor = 'pointer';

    adviceForm.appendChild(submitAdviceButton);
    adviceContent.appendChild(adviceTitle);
    adviceContent.appendChild(adviceForm);
    adviceContent.appendChild(closeAdviceButton);
    adviceModal.appendChild(adviceContent);
    document.body.appendChild(adviceModal);

 
    adviceLink.addEventListener('click', (e) => {
        e.preventDefault(); 
        adviceModal.style.display = 'flex';
    });

  
    closeAdviceButton.addEventListener('click', (e) => {
        e.preventDefault();
        adviceModal.style.display = 'none';
    });


    adviceModal.addEventListener('click', (e) => {
        if (e.target === adviceModal) {
            adviceModal.style.display = 'none';
        }
    });


    adviceForm.addEventListener('submit', (e) => {
        e.preventDefault();
         const phone = document.getElementById('advice-Phone').value;
        const name = document.getElementById('advice-name').value;
        const email = document.getElementById('advice-email').value;
        const message = document.getElementById('advice-message').value;


        adviceForm.reset();
        

        adviceModal.style.display = 'none';
    });
});
document.addEventListener('DOMContentLoaded', function() {
    const slides = document.querySelectorAll('.slide');
    let currentSlide = 0;

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

   
    setInterval(nextSlide, 5000);

 
    showSlide(0);
});


const cartCouponVue = new Vue({
    el: '#cartCoupon',
    data: {
        showCoupon: false,
        couponCode: '',
        couponApplied: false,
        couponInvalid: false,
        discount: 0
    },
    methods: {
        applyCoupon: function() {
            this.couponApplied = false;
            this.couponInvalid = false;
            if (this.couponCode.trim().toUpperCase() === "GROUP505") {
                this.couponApplied = true;
                this.discount = 10; 
              
                this.updateCartTotal();
            } else {
                this.couponInvalid = true;
            }
        },
        updateCartTotal: function() {
        
            const cartIcon = document.querySelector('.cart-icon a');
            if (cartIcon) cartIcon.click();
        }
    },
    mounted: function() {
        const cartCount = document.querySelector('.cart-count').textContent;
        if (parseInt(cartCount) > 0) {
            this.showCoupon = true;
        }
    }
});
