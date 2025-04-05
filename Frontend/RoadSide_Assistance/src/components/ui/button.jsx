export function Button({ children, onClick, type = "button", className = "" }) {
    return (
        <button
            type={type}
            onClick={onClick}
            className={`px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition ${className}`}
        >
            {children}
        </button>
    );
}
