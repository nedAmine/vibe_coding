 // Theme toggle functionality
        const themeToggle = document.getElementById('themeToggle');
        const body = document.body;

        // Check for saved theme preference or default to light
        const savedTheme = localStorage.getItem('theme') || 'light';
        if (savedTheme === 'dark') {
            body.classList.add('dark-theme');
        }

        themeToggle.addEventListener('click', () => {
            body.classList.toggle('dark-theme');
            
            // Save theme preference
            const currentTheme = body.classList.contains('dark-theme') ? 'dark' : 'light';
            localStorage.setItem('theme', currentTheme);
        });

        // Add to cart animation
        const addToCartButtons = document.querySelectorAll('.add-to-cart');
        
        addToCartButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Create a temporary animation effect
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 150);
                
                // In a real app, you would add the product to cart here
                console.log('Product added to cart!');
            });
        });

        // Wishlist functionality
        const wishlistButtons = document.querySelectorAll('.wishlist');
        
        wishlistButtons.forEach(button => {
            button.addEventListener('click', function() {
                this.classList.toggle('active');
                this.style.color = this.classList.contains('active') ? '#ff6584' : '';
                
                // In a real app, you would add/remove from wishlist here
                console.log('Wishlist updated!');
            });
        });