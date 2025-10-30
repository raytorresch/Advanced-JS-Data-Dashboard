export function Button({ id, label, onClick, type = 'button', className = '' }) {

    return `
        <button
            id='${id}'   
            type='${type}' class='${className}' onclick='${onClick}'>
            ${label}
        </button>
    `;
}