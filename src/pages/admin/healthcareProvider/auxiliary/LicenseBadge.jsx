import Badge from "../../components/ui/Badge";

export default function LicenseBadge({ license }) {

    const _license = license || { status: 'UnLicensed'  }

    if(!_license || typeof _license !== 'object' || !_license.status) return <></>

    return (
        <Badge
            className={"mt-2"}
            variant={_license.status === 'approved' ? 'default' : _license.status === 'pending' ? 'primary' : _license.status === 'rejected' ? 'danger' : 'secondary'}
        >
            {
                _license?.status === 'approved'
                    ?
                    'Licensed'
                    :
                    _license?.status === 'pending'
                        ?
                        'Pending License'
                        :
                        _license.status === 'rejected'
                            ?
                            'Rejected Licens'
                            :
                            'UnLicensed'
            }
        </Badge>
    )
}