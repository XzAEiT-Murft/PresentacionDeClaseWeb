// Variable para guardar temporalmente el email que se está registrando
let emailPendingVerification = '';

document.addEventListener('DOMContentLoaded', () => {
    
    // --- REFERENCIAS ---
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const verifyForm = document.getElementById('verifyForm');

    // Modales de Bootstrap (para abrirlos/cerrarlos con JS)
    const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
    const registerModal = new bootstrap.Modal(document.getElementById('registerModal'));
    const verifyModal = new bootstrap.Modal(document.getElementById('verifyModal'));

    // --- 1. LÓGICA DE LOGIN ---
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Evita que la página se recargue
        
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        const errorDiv = document.getElementById('loginError');

        errorDiv.style.display = 'none';

        const result = await login(email, password);

        if (result.error) {
            errorDiv.textContent = result.error;
            errorDiv.style.display = 'block';
        } else {
            // ¡Login exitoso!
            alert(`Bienvenido, ${result.role}!`);
            loginModal.hide();
            loginForm.reset();
            // Aquí podrías recargar la página o actualizar el UI
            window.location.reload(); 
        }
    });

    // --- 2. LÓGICA DE REGISTRO ---
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = document.getElementById('regName').value;
        const email = document.getElementById('regEmail').value;
        const password = document.getElementById('regPassword').value;
        const errorDiv = document.getElementById('regError');

        errorDiv.style.display = 'none';

        const result = await register(name, email, password);

        if (result.error) {
            errorDiv.textContent = result.error;
            errorDiv.style.display = 'block';
        } else {
            // Registro exitoso -> Pasamos a Verificar
            emailPendingVerification = email; // Guardamos el email para el siguiente paso
            registerModal.hide();
            registerForm.reset();
            verifyModal.show(); // Abrimos el modal de código
        }
    });

    // --- 3. LÓGICA DE VERIFICACIÓN ---
    verifyForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const code = document.getElementById('verifyCode').value;
        const errorDiv = document.getElementById('verifyError');

        errorDiv.style.display = 'none';

        const result = await verifyAccount(emailPendingVerification, code);

        if (result.error) {
            errorDiv.textContent = result.error;
            errorDiv.style.display = 'block';
        } else {
            // Verificación exitosa
            alert('Cuenta verificada. Ahora puedes iniciar sesión.');
            verifyModal.hide();
            verifyForm.reset();
            loginModal.show(); // Abrimos el login para que entre
        }
    });
});