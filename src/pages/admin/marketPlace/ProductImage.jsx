import { MdDelete } from "react-icons/md"

export default function ProductImage({ img, handleImgDelete = () => { } }) {

    if (!img) return <></>

    return (
        <div className='relative w-2/5'>
            <img
                src={img}
                style={{
                    // height: '300px',
                    // width: '200px'
                }}
                className='w-full'
            />

            <div onClick={handleImgDelete} className='bg-[#703DCB] p-3 absolute cursor-pointer top-0 right-0'>
                <MdDelete size={20} color='#FFF' />
            </div>
        </div>
    )
}