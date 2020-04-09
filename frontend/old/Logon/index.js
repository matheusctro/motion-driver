import React, { useState } from 'react';
import './styles.css';
import { useHistory } from 'react-router-dom';

export default function Logon() {
    const [id, setId] = useState('');
    const history = useHistory();

    function handleLogin(e) {
        e.preventDefault();
        
        try {
            localStorage.setItem('user_id', id);

            history.push('/home');
        } catch (err) {
            alert('Falha no login, tente novamente.')
        }
    }
    return (
        <div className="logon-container">
                <h1>Bem vindo(a) ao Motion Drive</h1>
            <section className="form">
                <form onSubmit={handleLogin}>
                    <h1>Faça seu login</h1>
                    <input
                        placeholder="Seu user"
                        value={id}
                        onChange={e => setId(e.target.value)}
                    />
                    <button className="button" type="submit">Entrar</button>
                    
                </form>
            </section>
        </div>
    );
}