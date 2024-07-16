function Input(props){
    return (
        <>
            <textarea rows='25' style={{ width: '100%', resize: 'none' }} />
            <div style={{ margin: 'auto' }}>
                <button>Save</button>
            </div>
        </>
    )
}

export default Input;