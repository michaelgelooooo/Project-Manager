import LoginForm from '../components/Authentication/LoginForm';
import RegisterForm from '../components/Authentication/RegisterForm';

function Authentication() {
    return (
        <div className="min-h-screen flex justify-center bg-base-100 px-8 pt-16 sm:pt-32">
            <div className="tabs tabs-box bg-base-300 shadow-xl p-8 mb-4 w-md rounded-2xl h-fit">
                <div className="w-full flex justify-center mb-8">
                    <div
                        className="text-4xl font-bold text-secondary hover:text-primary transform hover:scale-105 transition-all duration-150 ease-in-out"
                        style={{ fontFamily: "'Bungee Shade', sans-serif" }}
                    >
                        MOMENTUM
                    </div>
                </div>
                <input
                    type="radio"
                    name="auth_tabs"
                    className="tab flex-1 font-bold text-lg h-12 checked:bg-secondary hover:bg-primary checked:text-secondary-content hover:text-primary-content rounded-lg transition-colors duration-150 me-1"
                    aria-label="LOGIN"
                    defaultChecked
                />
                <div className="tab-content">
                    <div className="divider divider-neutral my-2"></div>
                    <LoginForm />
                </div>
                <input
                    type="radio"
                    name="auth_tabs"
                    className="tab flex-1 font-bold text-lg h-12 checked:bg-secondary hover:bg-primary checked:text-secondary-content hover:text-primary-content rounded-lg transition-colors duration-150 ms-1"
                    aria-label="REGISTER"
                />
                <div className="tab-content">
                    <div className="divider divider-neutral my-2"></div>
                    <RegisterForm />
                </div>
            </div>
        </div>
    );
}

export default Authentication;