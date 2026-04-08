import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

function LoginForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        const result = await login(username, password);
        if (result.success) {
            navigate('/');
        } else {
            setError(result.error);
        }
        setLoading(false);
    };

    return (
        <>
            {error && (
                <div className="alert alert-error mb-4">
                    <span>{error}</span>
                </div>
            )}
            <form onSubmit={handleSubmit}>
                <div className="form-control mb-4">
                    <label className="floating-label">
                        <span>Username</span>
                        <input
                            type="text"
                            placeholder="Enter username"
                            className="input input-lg input-secondary input-bordered w-full"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <div className="form-control">
                    <label className="floating-label">
                        <span>Password</span>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Enter password"
                                className="input input-lg input-secondary input-bordered w-full pr-12"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-base-content/50 hover:text-secondary transition-colors duration-150"
                                onClick={() => setShowPassword((prev) => !prev)}
                            >
                                <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                            </button>
                        </div>
                    </label>
                </div>
                <div className="divider divider-neutral"></div>
                <button
                    type="submit"
                    className={`btn btn-secondary hover:btn-primary btn-lg w-full ${loading ? 'loading' : ''}`}
                    disabled={loading}
                >
                    {loading ? 'Logging in...' : 'LOGIN'}
                </button>
            </form>
        </>
    );
}

export default LoginForm;