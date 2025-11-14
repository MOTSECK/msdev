// EmailJS Configuration
(function() {
    // 🔧 VOS IDS EMAILJS
    const EMAILJS_SERVICE_ID = 'service_ed4sw6x';
    const EMAILJS_TEMPLATE_ID = 'template_9bkcj5h';
    const EMAILJS_PUBLIC_KEY = 'L39yeirEkmWhZUuIK';
    
    // Fonction d'initialisation
    function initContactForm() {
        const contactForm = document.getElementById('contactForm');
        
        if (!contactForm) {
            console.log('Formulaire de contact non trouvé');
            return;
        }

        // Initialiser EmailJS
        if (EMAILJS_PUBLIC_KEY && typeof emailjs !== 'undefined') {
            emailjs.init(EMAILJS_PUBLIC_KEY);
        }

        const emailInput = document.getElementById('from_email');
        const submitBtn = document.getElementById('submitBtn');
        const confirmation = document.getElementById('form-confirmation');

        // Vérifications de sécurité
        if (!emailInput || !submitBtn || !confirmation) {
            console.error('Éléments manquants:', {
                emailInput: !!emailInput,
                submitBtn: !!submitBtn,
                confirmation: !!confirmation
            });
            return;
        }

        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoading = submitBtn.querySelector('.btn-loading');

        // === VALIDATION EN TEMPS RÉEL ===
        setupRealTimeValidation();

        // === GESTIONNAIRE DE SOUMISSION ===
        contactForm.addEventListener('submit', handleFormSubmit);

        function setupRealTimeValidation() {
            // Email
            emailInput.addEventListener('blur', validateEmail);
            emailInput.addEventListener('input', function() {
                if (this.value.trim()) validateEmail();
            });

            // Champs texte
            const textFields = ['firstname', 'lastname', 'message'];
            textFields.forEach(fieldId => {
                const field = document.getElementById(fieldId);
                if (field) {
                    field.addEventListener('blur', () => validateField(field));
                    field.addEventListener('input', function() {
                        if (this.value.trim()) validateField(this);
                    });
                }
            });

            // Sélecteur
            const projectType = document.getElementById('project_type');
            if (projectType) {
                projectType.addEventListener('change', () => validateField(projectType));
            }
        }

        function handleFormSubmit(e) {
            e.preventDefault();
            
            if (validateAllFields()) {
                // Désactiver le bouton
                submitBtn.disabled = true;
                if (btnText) btnText.style.display = 'none';
                if (btnLoading) btnLoading.style.display = 'inline';
                
                // Envoyer l'email
                sendFormData()
                    .finally(() => {
                        // Réactiver le bouton
                        submitBtn.disabled = false;
                        if (btnText) btnText.style.display = 'inline';
                        if (btnLoading) btnLoading.style.display = 'none';
                    });
            }
        }

        function validateAllFields() {
            let isValid = true;
            
            // Validation des champs requis
            const requiredFields = contactForm.querySelectorAll('[required]');
            requiredFields.forEach(field => {
                if (!validateField(field)) {
                    isValid = false;
                }
            });
            
            return isValid;
        }

        function validateField(field) {
            const value = field.value.trim();
            
            if (!value) {
                showError(field, 'Ce champ est obligatoire');
                return false;
            }
            
            // Validation spécifique selon le type de champ
            switch(field.id) {
                case 'from_email':
                    return validateEmail();
                case 'message':
                    return validateMessage();
                default:
                    clearError(field);
                    return true;
            }
        }
        
        function validateEmail() {
            const email = emailInput.value.trim();
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            
            if (!email) {
                showError(emailInput, 'L\'email est obligatoire');
                return false;
            } else if (!emailRegex.test(email)) {
                showError(emailInput, 'Format d\'email invalide (ex: exemple@domaine.com)');
                return false;
            } else {
                clearError(emailInput);
                return true;
            }
        }
        
        function validateMessage() {
            const messageInput = document.getElementById('message');
            const message = messageInput.value.trim();
            const minLength = 15;
            
            if (!message) {
                showError(messageInput, 'Le message est obligatoire');
                return false;
            } else if (message.length < minLength) {
                showError(messageInput, `Le message doit contenir au moins ${minLength} caractères (actuellement: ${message.length})`);
                return false;
            } else {
                clearError(messageInput);
                return true;
            }
        }

        async function sendFormData() {
            const formData = {
                from_name: `${getValue('firstname')} ${getValue('lastname')}`,
                first_name: getValue('firstname'),
                last_name: getValue('lastname'),
                from_email: getValue('from_email'),
                project_type: getValue('project_type'),
                message: getValue('message'),
                to_email: 'motseck07@gmail.com',
                date: new Date().toLocaleString('fr-FR'),
                character_count: getValue('message').length
            };
            
            try {
                // Vérifier que EmailJS est disponible
                if (typeof emailjs === 'undefined') {
                    throw new Error('EmailJS non chargé');
                }

                const response = await emailjs.send(
                    EMAILJS_SERVICE_ID,
                    EMAILJS_TEMPLATE_ID,
                    formData
                );
                
                if (response.status === 200) {
                    showConfirmation('Message envoyé avec succès ! Je vous recontacte dans les 24h.', 'success');
                    contactForm.reset();
                    clearAllErrors();
                } else {
                    throw new Error('Erreur EmailJS: ' + response.status);
                }
            } catch (error) {
                console.error('Erreur envoi email:', error);
                showConfirmation('Erreur lors de l\'envoi. Veuillez réessayer.', 'error');
            }
        }

        function getValue(fieldId) {
            const field = document.getElementById(fieldId);
            return field ? field.value : '';
        }
        
        function showConfirmation(message, type) {
            confirmation.textContent = message;
            confirmation.className = `confirmation-message ${type}`;
            confirmation.style.display = 'block';
            
            setTimeout(() => {
                confirmation.style.display = 'none';
            }, 5000);
        }
        
        function showError(field, message) {
            const errorElement = document.getElementById(field.id + '-error');
            if (errorElement) {
                errorElement.textContent = message;
                field.setAttribute('aria-invalid', 'true');
                field.classList.add('error-field');
            }
        }
        
        function clearError(field) {
            const errorElement = document.getElementById(field.id + '-error');
            if (errorElement) {
                errorElement.textContent = '';
                field.setAttribute('aria-invalid', 'false');
                field.classList.remove('error-field');
            }
        }

        function clearAllErrors() {
            const errorElements = document.querySelectorAll('.error-message');
            const errorFields = document.querySelectorAll('.error-field');
            
            errorElements.forEach(element => element.textContent = '');
            errorFields.forEach(field => {
                field.setAttribute('aria-invalid', 'false');
                field.classList.remove('error-field');
            });
        }
    }

    // Démarrer quand le DOM est prêt
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initContactForm);
    } else {
        initContactForm();
    }
})();
