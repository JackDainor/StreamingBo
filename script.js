
        // Tailwind script
        function initializeTailwind() {
            document.documentElement.style.setProperty('--accent', '#e50914');
        }

        // Products Data - PRECIOS EN BOLIVIANOS (Bs.)
        const products = [
            {
                id: 1,
                name: "Netflix",
                description: "Películas, series y documentales ilimitados en calidad 4K HDR con múltiples perfiles.",
                price: 112,
                logoSvg: `<img src="logo/netflix-logo.svg" class="w-20 h-9" alt="Netflix">`,
            },
            {
                id: 2,
                name: "Disney Standar",
                description: "Disney, Pixar, Marvel, Star Wars.",
                price: 63,
                logoSvg: `<img src="logo/disney-logo.svg" class="w-20 h-9" alt="Disney-Standar">`,
            },
            {
                id: 3,
                name: "Disney Premium",
                description: "Disney, Pixar, Marvel, Star Wars, National Geographic y 7 ESPN.",
                price: 63,
                logoSvg: `<img src="logo/disney-logo.svg" class="w-20 h-9" alt="Disney-Premium">`,
            },
            {
                id: 4,
                name: "HBO MAX PLATINO",
                description: "Las mejores series de HBO, películas de Warner Bros. y contenido premium.",
                price: 70,
                logoSvg: `<img src="logo/hbo-logo.svg" class="w-20 h-9" alt="HBO-PLATINO">`
            },
            {
                id: 5,
                name: "HBO MAX Standar",
                description: "Las mejores series de HBO, películas de Warner Bros.",
                price: 70,
                logoSvg: `<img src="logo/hbo-logo.svg" class="w-20 h-9" alt="HBO-PLATINO">`
            },            
            {
                id: 6,
                name: "Crunchyroll",
                description: "El mejor catálogo de anime, manga y doramas con episodios simultáneos.",
                price: 56,
                logoSvg: `<img src="logo/crunchyroll-logo.svg" class="w-20 h-9" alt="Crunchyroll">`
            },
            {
                id: 7,
                name: "Prime Video",
                description: "Películas, series originales de Amazon y miles de títulos en alta calidad.",
                price: 63,
                logoSvg: `<img src="logo/prime-logo.svg" class="w-20 h-9" alt="Prime-Video">`
            },
            {
                id: 8,
                name: "Vix",
                description: "Streaming en español con películas, series y contenido latinoamericano.",
                price: 42,
                logoSvg: `<img src="logo/vix-logo.svg" class="w-20 h-9" alt="Vix">`
            },
            {
                id: 9,
                name: "Canva Pro",
                description: "Diseño profesional con IA, plantillas premium, animaciones y herramientas avanzadas.",
                price: 91,
                logoSvg: `<img src="logo/capcut-logo.svg" class="w-20 h-9" alt="CapCut">`
            },
            {
                id: 11,
                name: "Spotify Premium",
                description: "Música sin anuncios, descargas offline, audio HiFi y podcasts exclusivos.",
                price: 77,
                logoSvg: `<img src="logo/spotify-logo.svg" class="w-20 h-9" alt="Spotify">`
            },
            {
                id: 12,
                name: "YouTube Premium",
                description: "YouTube sin anuncios, descargas, YouTube Music y reproducción en segundo plano.",
                price: 98,
                logoSvg: `<img src="logo/youtube-logo.svg" class="w-20 h-9" alt="YouTube">`
            }
        ]

        // Cart state
        let cart = []
        let currentMode = null // 'direct' | 'cart'
        let currentProduct = null

        // Load cart from localStorage
        function loadCart() {
            const savedCart = localStorage.getItem('streamhub_cart')
            if (savedCart) {
                cart = JSON.parse(savedCart)
            }
            updateFloatingCartBadge()
        }

        function saveCart() {
            localStorage.setItem('streamhub_cart', JSON.stringify(cart))
        }

        // Update floating cart badge
        function updateFloatingCartBadge() {
            const badge = document.getElementById('cart-badge')
            const totalItems = cart.reduce((sum, item) => sum + item.qty, 0)
            badge.textContent = totalItems
            badge.style.display = totalItems > 0 ? 'flex' : 'none'
        }

        // Render all products
        function renderProducts(filteredProducts = products) {
            const grid = document.getElementById('products-grid')
            grid.innerHTML = ''
            
            filteredProducts.forEach(product => {
                const card = createProductCard(product)
                grid.appendChild(card)
            })
        }

        // Create single product card
        function createProductCard(product) {
            const card = document.createElement('div')
            card.className = `product-card bg-zinc-900 border border-zinc-700 rounded-3xl overflow-hidden flex flex-col h-full`
            
            card.innerHTML = `
                <div class="h-24 bg-zinc-950 flex items-center justify-center p-5 border-b border-zinc-700">
                    ${product.logoSvg}
                </div>
                
                <div class="p-5 flex flex-col flex-1">
                    <div class="flex-1">
                        <h3 class="font-bold text-[21px] tracking-tighter leading-none mb-2">${product.name}</h3>
                        <p class="text-zinc-400 text-[13.5px] leading-snug line-clamp-3">${product.description}</p>
                    </div>
                    
                    <div class="mt-5">
                        <div class="flex items-end justify-between mb-3">
                            <div>
                                <span class="text-3xl font-semibold tracking-tighter service-price">Bs. ${product.price}</span>
                                <span class="text-xs text-zinc-400 ml-0.5">/mes</span>
                            </div>
                        </div>
                        
                        <div class="grid grid-cols-2 gap-2">
                            <button onclick="addToCart(${product.id}); event.stopImmediatePropagation();" 
                                    class="py-[10px] text-xs font-semibold border border-zinc-600 hover:bg-zinc-800 active:bg-zinc-700 transition-all rounded-2xl flex items-center justify-center gap-x-1.5">
                                <i class="fa-solid fa-cart-plus text-sm"></i>
                                <span>Agregar</span>
                            </button>
                            
                            <button onclick="buyDirect(${product.id}); event.stopImmediatePropagation();" 
                                    class="py-[10px] text-xs font-bold bg-red-600 hover:bg-red-700 active:bg-red-800 transition-all rounded-2xl flex items-center justify-center gap-x-1.5 text-white">
                                <span>Comprar ahora</span>
                            </button>
                        </div>
                    </div>
                </div>
            `
            return card
        }

        // Filter products (desktop)
        function filterProducts() {
            const term = document.getElementById('search-input').value.toLowerCase().trim()
            const filtered = products.filter(p => 
                p.name.toLowerCase().includes(term) || 
                p.description.toLowerCase().includes(term)
            )
            renderProducts(filtered)
        }

        // Filter products (mobile)
        function filterProductsMobile() {
            const term = document.getElementById('search-input-mobile').value.toLowerCase().trim()
            const filtered = products.filter(p => 
                p.name.toLowerCase().includes(term) || 
                p.description.toLowerCase().includes(term)
            )
            renderProducts(filtered)
            
            // Sync desktop search if exists
            const desktopSearch = document.getElementById('search-input')
            if (desktopSearch) desktopSearch.value = term
        }

        // Add to cart
        function addToCart(id) {
            const product = products.find(p => p.id === id)
            if (!product) return

            const existing = cart.find(item => item.id === id)
            
            if (existing) {
                existing.qty = (existing.qty || 1) + 1
                showToast(`+1 mes de ${product.name} agregado`)
            } else {
                cart.push({ ...product, qty: 1 })
                showToast(`${product.name} agregado al carrito`)
            }
            
            saveCart()
            updateFloatingCartBadge()
            
            // Optional: brief animation on badge
            const badge = document.getElementById('cart-badge')
            badge.style.transform = 'scale(1.4)'
            setTimeout(() => {
                badge.style.transform = 'scale(1)'
            }, 180)
        }

        // Buy direct (opens purchase modal for single product)
        function buyDirect(id) {
            const product = products.find(p => p.id === id)
            if (!product) return
            
            currentMode = 'direct'
            currentProduct = product
            
            openPurchaseModal()
        }

        // Open cart modal
        function openCartModal() {
            const modal = document.getElementById('cart-modal')
            modal.classList.remove('hidden')
            modal.classList.add('flex')
            
            renderCartItems()
        }

        function closeCartModal() {
            const modal = document.getElementById('cart-modal')
            modal.classList.remove('flex')
            modal.classList.add('hidden')
        }

        // Render cart items inside modal
        function renderCartItems() {
            const container = document.getElementById('cart-items-container')
            const totalEl = document.getElementById('cart-total')
            
            if (cart.length === 0) {
                container.innerHTML = `
                    <div class="flex flex-col items-center justify-center py-10 text-center">
                        <i class="fa-solid fa-shopping-cart text-5xl text-zinc-700 mb-4"></i>
                        <p class="text-zinc-400">Tu carrito está vacío</p>
                        <button onclick="closeCartModal()" class="mt-4 text-xs px-5 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-2xl transition-colors">Explorar servicios</button>
                    </div>
                `
                totalEl.textContent = 'Bs. 0.00'
                return
            }
            
            let html = ''
            let total = 0
            
            cart.forEach((item, index) => {
                const subtotal = item.price * (item.qty || 1)
                total += subtotal
                
                html += `
                    <div class="bg-zinc-800 border border-zinc-700 rounded-2xl p-4 flex gap-4">
                        <div class="w-14 flex-shrink-0 flex items-center justify-center">
                            ${item.logoSvg.replace('class="w-20 h-9"', 'class="w-12 h-6"')}
                        </div>
                        
                        <div class="flex-1 min-w-0">
                            <div class="flex justify-between items-start">
                                <div>
                                    <div class="font-semibold">${item.name}</div>
                                    <div class="text-emerald-400 text-xs">Bs. ${item.price} × ${item.qty || 1}</div>
                                </div>
                                <div class="font-semibold text-right">Bs. ${subtotal.toFixed(2)}</div>
                            </div>
                            
                            <!-- Quantity controls -->
                            <div class="flex items-center justify-between mt-3">
                                <div class="flex items-center bg-zinc-900 border border-zinc-700 rounded-2xl overflow-hidden">
                                    <button onclick="changeCartQty(${item.id}, -1)" class="w-8 h-8 flex items-center justify-center hover:bg-zinc-700 active:bg-zinc-600 transition-colors text-lg leading-none">−</button>
                                    <div class="px-3 text-sm font-medium tabular-nums">${item.qty || 1}</div>
                                    <button onclick="changeCartQty(${item.id}, 1)" class="w-8 h-8 flex items-center justify-center hover:bg-zinc-700 active:bg-zinc-600 transition-colors text-lg leading-none">+</button>
                                </div>
                                
                                <button onclick="removeFromCart(${item.id})" class="text-red-400 hover:text-red-500 px-2 py-1 text-xs flex items-center gap-x-1">
                                    <i class="fa-solid fa-trash text-xs"></i>
                                    <span class="hidden md:inline">Quitar</span>
                                </button>
                            </div>
                        </div>
                    </div>
                `
            })
            
            container.innerHTML = html
            totalEl.textContent = `Bs. ${total.toFixed(2)}`
        }

        function changeCartQty(id, delta) {
            const item = cart.find(i => i.id === id)
            if (!item) return
            
            item.qty = (item.qty || 1) + delta
            if (item.qty < 1) item.qty = 1
            
            saveCart()
            renderCartItems()
            updateFloatingCartBadge()
        }

        function removeFromCart(id) {
            cart = cart.filter(item => item.id !== id)
            saveCart()
            renderCartItems()
            updateFloatingCartBadge()
        }

        function clearCart() {
            if (!confirm('¿Vaciar todo el carrito?')) return
            cart = []
            saveCart()
            renderCartItems()
            updateFloatingCartBadge()
        }

        // Initiate purchase from cart
        function initiatePurchaseFromCart() {
            if (cart.length === 0) return
            currentMode = 'cart'
            currentProduct = null
            closeCartModal()
            openPurchaseModal()
        }

        // Open purchase modal (dynamic)
        function openPurchaseModal() {
            const modal = document.getElementById('purchase-modal')
            const contentContainer = document.getElementById('purchase-content')
            
            let html = ''
            
            if (currentMode === 'direct' && currentProduct) {
                // DIRECT PURCHASE
                html = `
                    <div>
                        <!-- Product summary -->
                        <div class="bg-zinc-800 border border-zinc-700 rounded-2xl p-4 mb-6">
                            <div class="flex items-center gap-x-4">
                                <div class="flex-shrink-0">
                                    ${currentProduct.logoSvg}
                                </div>
                                <div class="flex-1 min-w-0">
                                    <div class="font-bold text-xl tracking-tight">${currentProduct.name}</div>
                                    <div class="text-emerald-400 font-semibold">Bs. ${currentProduct.price} <span class="text-xs text-emerald-400/70">/ mes</span></div>
                                </div>
                            </div>
                            <div class="mt-3 text-sm text-zinc-300 leading-snug">
                                ${currentProduct.description}
                            </div>
                        </div>
                        
                        <form id="purchase-form" onsubmit="handlePurchaseSubmit(event)">
                            <div class="space-y-4">
                                <!-- Form fields -->
                                <div>
                                    <label class="block text-xs font-medium tracking-wider text-zinc-300 mb-1.5 px-1">NOMBRE COMPLETO</label>
                                    <input type="text" id="full-name" required 
                                           class="w-full bg-zinc-800 border border-zinc-600 focus:border-red-500 transition-colors px-4 py-[13px] rounded-2xl text-white placeholder:text-zinc-400 text-sm"
                                           placeholder="Ej: María González">
                                </div>
                                
                                <div>
                                    <label class="block text-xs font-medium tracking-wider text-zinc-300 mb-1.5 px-1">NÚMERO DE WHATSAPP</label>
                                    <input type="tel" id="whatsapp" required value="+591 " 
                                           class="w-full bg-zinc-800 border border-zinc-600 focus:border-red-500 transition-colors px-4 py-[13px] rounded-2xl text-white placeholder:text-zinc-400 text-sm"
                                           placeholder="+591 6XXXXXXX">
                                </div>
                                
                                <div>
                                    <label class="block text-xs font-medium tracking-wider text-zinc-300 mb-1.5 px-1">CORREO ELECTRÓNICO</label>
                                    <input type="email" id="email" required 
                                           class="w-full bg-zinc-800 border border-zinc-600 focus:border-red-500 transition-colors px-4 py-[13px] rounded-2xl text-white placeholder:text-zinc-400 text-sm"
                                           placeholder="tu@email.com">
                                </div>
                            </div>
                            
                            <div class="mt-7">
                                <button type="submit" 
                                        class="w-full bg-[#25D366] hover:bg-[#128C7E] active:bg-[#0e6b5e] transition-all text-white font-bold py-4 rounded-3xl flex items-center justify-center gap-x-2 text-base shadow-inner">
                                    <i class="fa-brands fa-whatsapp text-xl"></i>
                                    <span>ENVIAR SOLICITUD POR WHATSAPP</span>
                                </button>
                                
                                <p class="text-center text-[10px] text-zinc-400 mt-3 px-2 leading-tight">
                                    Al continuar, se abrirá WhatsApp con tu solicitud lista para enviar al número +591 63614354
                                </p>
                            </div>
                        </form>
                    </div>
                `
            } else if (currentMode === 'cart') {
                // CART PURCHASE
                let cartSummaryHTML = ''
                let total = 0
                
                cart.forEach(item => {
                    const sub = item.price * (item.qty || 1)
                    total += sub
                    cartSummaryHTML += `
                        <div class="flex justify-between text-sm py-2.5 border-b border-zinc-700 last:border-none">
                            <div class="flex items-center gap-x-2">
                                <span class="font-medium">${item.name}</span>
                                <span class="text-xs px-2 py-px bg-zinc-700 rounded">x${item.qty || 1}</span>
                            </div>
                            <span class="font-semibold tabular-nums">Bs. ${sub.toFixed(2)}</span>
                        </div>
                    `
                })
                
                html = `
                    <div>
                        <!-- Cart summary -->
                        <div class="mb-5">
                            <div class="text-xs uppercase tracking-[1px] font-medium text-zinc-400 mb-2 px-1">RESUMEN DEL PEDIDO</div>
                            <div class="bg-zinc-800 border border-zinc-700 rounded-2xl p-4 text-sm">
                                ${cartSummaryHTML}
                                
                                <div class="flex justify-between pt-3 mt-2 border-t border-zinc-600 font-bold text-base">
                                    <span>TOTAL</span>
                                    <span class="tabular-nums">Bs. ${total.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                        
                        <form id="purchase-form" onsubmit="handlePurchaseSubmit(event)">
                            <div class="space-y-4">
                                <div>
                                    <label class="block text-xs font-medium tracking-wider text-zinc-300 mb-1.5 px-1">NOMBRE COMPLETO</label>
                                    <input type="text" id="full-name" required 
                                           class="w-full bg-zinc-800 border border-zinc-600 focus:border-red-500 transition-colors px-4 py-[13px] rounded-2xl text-white placeholder:text-zinc-400 text-sm"
                                           placeholder="Ej: Carlos Mendoza">
                                </div>
                                
                                <div>
                                    <label class="block text-xs font-medium tracking-wider text-zinc-300 mb-1.5 px-1">NÚMERO DE WHATSAPP</label>
                                    <input type="tel" id="whatsapp" required value="+591 " 
                                           class="w-full bg-zinc-800 border border-zinc-600 focus:border-red-500 transition-colors px-4 py-[13px] rounded-2xl text-white placeholder:text-zinc-400 text-sm"
                                           placeholder="+591 6XXXXXXX">
                                </div>
                                
                                <div>
                                    <label class="block text-xs font-medium tracking-wider text-zinc-300 mb-1.5 px-1">CORREO ELECTRÓNICO</label>
                                    <input type="email" id="email" required 
                                           class="w-full bg-zinc-800 border border-zinc-600 focus:border-red-500 transition-colors px-4 py-[13px] rounded-2xl text-white placeholder:text-zinc-400 text-sm"
                                           placeholder="tu@email.com">
                                </div>
                            </div>
                            
                            <div class="mt-7">
                                <button type="submit" 
                                        class="w-full bg-[#25D366] hover:bg-[#128C7E] active:bg-[#0e6b5e] transition-all text-white font-bold py-4 rounded-3xl flex items-center justify-center gap-x-2 text-base shadow-inner">
                                    <i class="fa-brands fa-whatsapp text-xl"></i>
                                    <span>ENVIAR PEDIDO POR WHATSAPP</span>
                                </button>
                                
                                <p class="text-center text-[10px] text-zinc-400 mt-3 px-2 leading-tight">
                                    Tu solicitud será enviada al equipo de StreamHub (+591 63614354)
                                </p>
                            </div>
                        </form>
                    </div>
                `
            }
            
            contentContainer.innerHTML = html
            modal.classList.remove('hidden')
            modal.classList.add('flex')
            
            // Focus first input
            setTimeout(() => {
                const firstInput = document.getElementById('full-name')
                if (firstInput) firstInput.focus()
            }, 400)
        }

        function closePurchaseModal() {
            const modal = document.getElementById('purchase-modal')
            modal.classList.remove('flex')
            modal.classList.add('hidden')
        }

        // Handle form submit → build message and open WhatsApp
        function handlePurchaseSubmit(e) {
            e.preventDefault()
            
            const name = document.getElementById('full-name').value.trim()
            const whatsapp = document.getElementById('whatsapp').value.trim()
            const email = document.getElementById('email').value.trim()
            
            if (!name || !whatsapp || !email) {
                alert('Por favor completa todos los campos.')
                return
            }
            
            let message = `🛒 *SOLICITUD DE SUSCRIPCIÓN - StreamHub*\n\n`
            
            if (currentMode === 'direct' && currentProduct) {
                message += `*Producto:* ${currentProduct.name}\n`
                message += `*Precio:* Bs. ${currentProduct.price} / mes\n`
                message += `*Descripción:* ${currentProduct.description}\n\n`
            } else if (currentMode === 'cart') {
                message += `*Productos solicitados:*\n`
                let total = 0
                
                cart.forEach(item => {
                    const qty = item.qty || 1
                    const subtotal = (item.price * qty).toFixed(2)
                    total += item.price * qty
                    message += `• ${item.name} × ${qty} = Bs. ${subtotal}\n`
                })
                
                message += `\n*TOTAL:* Bs. ${total.toFixed(2)}\n\n`
            }
            
            message += `*DATOS DEL CLIENTE:*\n`
            message += `Nombre: ${name}\n`
            message += `WhatsApp: ${whatsapp}\n`
            message += `Email: ${email}\n\n`
            message += `Hola, por favor contáctame para procesar esta solicitud y activar mi(s) suscripción(es). ¡Gracias!`
            
            // Open WhatsApp
            const encodedMessage = encodeURIComponent(message)
            window.open(`https://wa.me/59163614354?text=${encodedMessage}`, '_blank')
            
            // Close modal
            closePurchaseModal()
            
            // If it was a cart purchase, clear the cart
            if (currentMode === 'cart') {
                cart = []
                saveCart()
                updateFloatingCartBadge()
            }
            
            // Success toast
            setTimeout(() => {
                showToast('✅ ¡Solicitud enviada! Revisa WhatsApp para completar el envío.', 4200)
            }, 650)
        }

        // General WhatsApp button (floating)
        function openWhatsAppGeneral() {
            const message = encodeURIComponent(`Hola StreamHub 👋\n\nMe gustaría recibir información sobre las suscripciones disponibles.`)
            window.open(`https://wa.me/59163614354?text=${message}`, '_blank')
        }

        // Toast notification
        function showToast(message, duration = 2800) {
            const container = document.getElementById('toast-container')
            
            const toast = document.createElement('div')
            toast.className = `toast max-w-[92%] md:max-w-md bg-zinc-800 border border-zinc-600 text-white px-5 py-3.5 rounded-3xl shadow-2xl flex items-start gap-x-3 text-sm`
            toast.innerHTML = `
                <div class="flex-1 pt-0.5">${message}</div>
                <button onclick="this.parentElement.remove()" class="text-zinc-400 hover:text-white mt-0.5">
                    <i class="fa-solid fa-times"></i>
                </button>
            `
            
            container.appendChild(toast)
            
            setTimeout(() => {
                if (toast && toast.parentElement) {
                    toast.style.transition = 'all 0.25s ease'
                    toast.style.opacity = '0'
                    setTimeout(() => toast.remove(), 200)
                }
            }, duration)
        }

        // Sync mobile and desktop search
        function syncSearchInputs() {
            const desktop = document.getElementById('search-input')
            const mobile = document.getElementById('search-input-mobile')
            
            if (desktop && mobile) {
                desktop.addEventListener('input', () => {
                    if (mobile.value !== desktop.value) mobile.value = desktop.value
                })
                
                mobile.addEventListener('input', () => {
                    if (desktop.value !== mobile.value) desktop.value = mobile.value
                })
            }
        }

        // Keyboard support (ESC to close modals)
        function setupKeyboardControls() {
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape') {
                    const purchaseModal = document.getElementById('purchase-modal')
                    const cartModal = document.getElementById('cart-modal')
                    
                    if (!purchaseModal.classList.contains('hidden')) {
                        closePurchaseModal()
                    } else if (!cartModal.classList.contains('hidden')) {
                        closeCartModal()
                    }
                }
                
                if (e.key === '/' && document.activeElement.tagName === 'BODY') {
                    e.preventDefault()
                    const search = document.getElementById('search-input')
                    if (search) search.focus()
                }
            })
            
            // Press "/" to focus search (desktop)
            console.log('%c[StreamHub] Presiona "/" para enfocar la búsqueda', 'color:#444')
        }

        // Initialize everything
        function initializeApp() {
            initializeTailwind()
            loadCart()
            renderProducts()
            syncSearchInputs()
            setupKeyboardControls()
            
            console.log('%c[StreamHub Demo] Página lista. Precios ahora en Bolivianos (Bs.). Footer actualizado con datos de Jack Dainor.', 'color:#666')
            
            updateFloatingCartBadge()
        }

        // Boot app
        window.onload = initializeApp
    