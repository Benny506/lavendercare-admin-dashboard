import { formatNumberWithCommas, groupBy } from "../../../lib/utils";

export const ProductVariantsDisplay = ({ variants, selectedVariants, handleVariantSelect, showInfo=true }) => {

    const groupedVariants = groupBy({ arr: variants || [], key: 'variant_type' })

    return Object.keys(groupedVariants).map((grouped_variant_type, i) => {
        const variants = groupedVariants[grouped_variant_type]

        if (grouped_variant_type?.toLowerCase() === 'default') {
            if (Object.keys(groupedVariants)?.length > 0) return;
        }

        return (
            <div
                key={i}
                className="mb-3"
            >
                <p className="fw-bold txt-16 txt-000 mb-3 text-capitalize">
                    {grouped_variant_type}
                </p>

                <div className="d-flex align-items-center flex-wrap gap-3">
                    {
                        variants?.map((v, vIndex) => {
                            const { id, variant_value, variant_type, stock, increment } = v

                            const isColor = variant_type === 'color'

                            const isSelected =
                                selectedVariants?.[variant_type]?.['variant_type'] === variant_type
                                &&
                                selectedVariants?.[variant_type]?.['variant_value'] === variant_value

                            const onVariantClick = () => {
                                handleVariantSelect && handleVariantSelect({ variant: v })
                            }

                            return (
                                <div
                                    key={vIndex}
                                    className="d-flex align-items-center gap-2"
                                >
                                    <div
                                        style={{
                                            borderBottom: isSelected ? '5px solid #2d5f4f' : 'none',
                                            paddingBottom: isSelected ? '10px' : '0px',
                                            borderRadius: '2px'
                                        }}
                                        className=""
                                    >
                                        <div
                                            key={vIndex}
                                            onClick={onVariantClick}
                                            className={handleVariantSelect && "clickable"}
                                            style={{
                                                padding: isColor ? '20px' : '8.5px 20px',
                                                // minWidth: isColor ? '40px' : '60px',
                                                // minHeight: isColor ? '40px' : '45px',
                                                border: '1px solid #e5e7eb',
                                                backgroundColor: isColor ? variant_value : 'white',
                                                color: '#6b7280',
                                                fontWeight: '500',
                                                borderRadius: isColor ? '100px' : '6px',
                                                textTransform: 'capitalize',
                                            }}
                                        >
                                            {
                                                !isColor
                                                &&
                                                variant_value
                                            }
                                        </div>
                                    </div>

                                    {
                                        showInfo
                                        &&
                                        <div>
                                            {
                                                increment > 0
                                                &&
                                                <p className="m-0 p-0 fw-600 txt-737373 mb-0 txt-13">
                                                    +{formatNumberWithCommas({ value: increment })}
                                                </p>
                                            }
                                            <p className="m-0 p-0 fw-600 txt-737373 txt-13">
                                                {stock} left
                                            </p>
                                        </div>
                                    }
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        )
    })
}