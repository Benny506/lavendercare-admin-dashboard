export default function ErrorMsg1({ errorMsg, position }){
    return(
        <p 
            style={{
                textAlign: position || 'left'
            }}
            className="m-0 p-0 fw-bold text-[15px] my-3 text-[#EB1C25]"
        >
            { errorMsg }
        </p>
    )
}