import React, { useEffect, useRef } from 'react';

const Login = () => {
  const scriptContainerRef = useRef(null);

  useEffect(() => {
    // 1. Funksiyani darhol global oynaga (window) e'lon qilamiz
    window.onTelegramAuth = async (user) => {
      console.log("DIQQAT! Telegram funksiyasi ishga tushdi!");
      console.log("User ma'lumotlari:", user);

      try {
        const response = await fetch('http://localhost:3000/api/auth/telegram', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(user),
        });
        const data = await response.json();
        console.log("Backend javobi:", data);
        if(data.success) alert("Kirdingiz!");
      } catch (err) {
        console.error("Backend ulanish xatosi:", err);
      }
    };

    // 2. Skriptni yaratish
    const script = document.createElement('script');
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.setAttribute('data-telegram-login', 'auth_tg_robot'); // O'zgartiring!
    script.setAttribute('data-size', 'large');
    script.setAttribute('data-onauth', 'onTelegramAuth(user)'); // Global funksiya nomi
    script.setAttribute('data-request-access', 'write');
    script.async = true;

    // 3. Tozalash va qo'shish
    if (scriptContainerRef.current) {
      scriptContainerRef.current.innerHTML = '';
      scriptContainerRef.current.appendChild(script);
    }
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '50px' }}>
      <h2>Telegram Auth Test</h2>
      <div ref={scriptContainerRef}></div>
    </div>
  );
};

export default Login;