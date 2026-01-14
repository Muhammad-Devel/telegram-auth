import React, { useEffect, useRef, useState } from 'react';

const Login = () => {
  const scriptContainerRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 1. Telegramdan ma'lumot kelganda ishlovchi global funksiya
    window.onTelegramAuth = async (user) => {
      setLoading(true);
      setError(null);
      console.log("Telegramdan kelgan ma'lumot:", user);

      try {
        const response = await fetch('http://localhost:3000/api/auth/telegram', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(user),
        });

        const data = await response.json();

        if (data.success) {
          localStorage.setItem('token', data.token);
          alert("Muvaffaqiyatli kirdingiz!");
          // Kirgandan so'ng sahifani yangilash yoki yo'naltirish
          window.location.reload();
        } else {
          setError(data.message || "Xatolik yuz berdi");
        }
      } catch (err) {
        setError("Backend serverga ulanib bo'lmadi");
      } finally {
        setLoading(false);
      }
    };

    // 2. Telegram Widget skriptini yuklash
    const script = document.createElement('script');
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.setAttribute('data-telegram-login', 'auth_tg_robot'); // @ belgisiz yozing
    script.setAttribute('data-size', 'large');
    script.setAttribute('data-onauth', 'onTelegramAuth(user)');
    script.setAttribute('data-request-access', 'write');
    script.async = true;

    if (scriptContainerRef.current) {
      scriptContainerRef.current.innerHTML = ''; 
      scriptContainerRef.current.appendChild(script);
    }
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>Tizimga kirish</h2>
        <p>Telegram orqali tasdiqlang</p>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <div style={styles.widgetWrapper}>
          {loading ? <span>Yuklanmoqda...</span> : <div ref={scriptContainerRef}></div>}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f5f5f5' },
  card: { padding: '30px', background: '#fff', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', textAlign: 'center' },
  widgetWrapper: { marginTop: '20px', display: 'flex', justifyContent: 'center' }
};

export default Login;