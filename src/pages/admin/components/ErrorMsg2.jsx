import error from '../../../assets/error.svg'

export default function ErrorMsg2({ errorMsg }){
    return(
        <div
            style={{
                flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
                justifyContent: 'center', gap: '15px',
                height: '100%', flexGrow: 1
            }}
        >
            <div>
                <img 
                    src={error}
                    alt="error-icon"
                    style={{
                        width: '80px', height: '80px'
                    }}
                />
            </div>
            <p 
                style={{
                    textAlign: "center"
                }}
                className="m-0 p-0 font-family-GT fw-600 txt-15 my-3 txt-EB1C25"
            >
                { errorMsg }
            </p>
        </div>
    )
}