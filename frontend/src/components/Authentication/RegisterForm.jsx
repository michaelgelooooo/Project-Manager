import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

function RegisterForm() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);

        const result = await register(username, password, email);

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
                            placeholder="Choose a username"
                            className="input input-lg input-secondary input-bordered w-full"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </label>
                </div>

                <div className="form-control mb-4">
                    <label className="floating-label">
                        <span>Email</span>
                        <input
                            type="email"
                            placeholder="Enter email"
                            className="input input-lg input-secondary input-bordered w-full"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </label>
                </div>

                <div className="form-control mb-4">
                    <label className="floating-label">
                        <span>Password</span>
                        <input
                            type="password"
                            placeholder="Create password"
                            className="input input-lg input-secondary input-bordered w-full"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </label>
                </div>

                <div className="form-control">
                    <label className="floating-label">
                        <span>Confirm Password</span>
                        <input
                            type="password"
                            placeholder="Confirm password"
                            className="input input-lg input-secondary input-bordered w-full"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </label>
                </div>

                <div className="divider divider-neutral"></div>

                <button
                    type="submit"
                    className={`btn btn-secondary hover:btn-primary btn-lg w-full ${loading ? 'loading' : ''}`}
                    disabled={loading}
                >
                    {loading ? 'Creating account...' : 'REGISTER'}
                </button>
            </form>
        </>
    );
}

export default RegisterForm;