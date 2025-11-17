import { formatNumberWithCommas, groupBy } from "../../../lib/utils";
import { ColorCircle } from "../components/ColorPicker";

export const ProductVariantsDisplay = ({ variants = {} }) => {
    return Object.keys(variants)?.map((key, i) => {
        const variantType = key
        const variantValue = variants?.[key]

        if (!variantType || !variantValue) return;

        const isColor = variantType === 'color' ? true : false

        return (
            <div className="flex gap-2 items-center">
                <p className="fw-bold text-sm text-gray-500">
                    {variantType}
                </p>

                <p className="fw-bold text-sm text-gray-700">
                    {
                        isColor
                            ?
                            <ColorCircle color={variantValue} />
                            :
                            variantValue
                    }
                </p>
            </div>
        )
    })
}