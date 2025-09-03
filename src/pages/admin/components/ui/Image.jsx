export default function Image({ src, alt, className, onClick }){

    const handleImgClick = (e) => onClick && onClick(e)

    return(
        <img 
            src={`${import.meta.env.BASE_URL}${src}`}
            alt={alt}
            className={className}
            onClick={handleImgClick}
        />
    )
}