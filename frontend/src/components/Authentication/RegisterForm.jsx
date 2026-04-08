import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

function RegisterForm() {
    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

        const result = await register(username, password, email, firstName, lastName);

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

                {/* First & Last Name side by side */}
                <div className="flex gap-4 mb-4">
                    <div className="form-control flex-1">
                        <label className="floating-label">
                            <span>First Name</span>
                            <input
                                type="text"
                                placeholder="First name"
                                className="input input-lg input-secondary input-bordered w-full"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                        </label>
                    </div>
                    <div className="form-control flex-1">
                        <label className="floating-label">
                            <span>Last Name</span>
                            <input
                                type="text"
                                placeholder="Last name"
                                className="input input-lg input-secondary input-bordered w-full"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                            />
                        </label>
                    </div>
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
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Create password"
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

                <div className="form-control">
                    <label className="floating-label">
                        <span>Confirm Password</span>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                placeholder="Confirm password"
                                className="input input-lg input-secondary input-bordered w-full pr-12"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-base-content/50 hover:text-secondary transition-colors duration-150"
                                onClick={() => setShowConfirmPassword((prev) => !prev)}
                            >
                                <i className={`fa-solid ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
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
                    {loading ? 'Creating account...' : 'REGISTER'}
                </button>
            </form>
        </>
    );
}

export default RegisterForm;