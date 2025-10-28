import { groupBy } from "./utils"

export const productCategories = ['fashion', 'accessories', 'home_decor']

export const currencies = [
    { title: 'NGN', symbol: '₦', value: 'NGN' }
]

export const productVariants = ['default', 'color', 'size']

export const sizeVariants = ['s', 'm', 'l', 'xl', 'xxl', 'xxxl']

export const increaseByOptions = [10, 50, 100, 200, 500, 1000, 1500]

export const ProductVariantsDisplay = ({ variants }) => {

    const groupedVariants = groupBy({ arr: variants || [], key: 'variant_type' })

    return Object.keys(groupedVariants).map((grouped_variant_type, i) => {
        const variants = groupedVariants[grouped_variant_type]

        return (
            <div
                key={i}
                className="mb-3"
            >
                <p className="fw-bold txt-16 txt-000 mb-3 text-capitalize">
                    {grouped_variant_type}
                </p>

                <div className="d-flex align-items-center flex-wrap gap-2">
                    {
                        variants?.map((v, vIndex) => {
                            const { variant_value, variant_type } = v

                            const isColor = variant_type === 'color'

                            return (
                                <div
                                    key={vIndex}
                                    style={{
                                        padding: isColor ? '20px' : '8.5px 20px',
                                        // minWidth: isColor ? '40px' : '60px',
                                        // minHeight: isColor ? '40px' : '45px',
                                        border: '1px solid #e5e7eb',
                                        backgroundColor: isColor ? variant_value : 'white',
                                        color: '#6b7280',
                                        fontWeight: '500',
                                        borderRadius: isColor ? '100px' : '6px',
                                        textTransform: 'capitalize'
                                    }}
                                >
                                    {
                                        !isColor
                                        &&
                                        variant_value
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