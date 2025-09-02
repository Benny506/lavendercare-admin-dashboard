// USERS
export const userTypes = ['mother', 'provider', 'vendor']





// VENDORS 
export const vendorStatuses = ['pending', 'approved', 'rejected']
export const vendorStatusColors = {
  pending: "bg-orange-100 text-orange-600",
  approved: "bg-green-100 text-green-600",
  rejected: "bg-red-100 text-red-600",
};





// PROVIDERS 
export const providerStatus = ['pending', 'approved', 'rejected']
export const providerStatusColors = {
  pending: "bg-orange-100 text-orange-600",
  approved: "bg-green-100 text-green-600",
  rejected: "bg-red-100 text-red-600",
};





// RISK && ALERT LEVEL 
export const RISK_LEVEL_STYLES = {
  "low": { 
    bg: 'bg-green-100', 
    text: 'text-green-700', 
    interpretation: 'Minimal concern — generally safe or healthy condition' 
  }, 
  "mild": { 
    bg: 'bg-yellow-100', 
    text: 'text-yellow-700', 
    interpretation: 'Slight concern — monitor but not alarming' 
  },
  "moderate": { 
    bg: 'bg-orange-100', 
    text: 'text-orange-700', 
    interpretation: 'Noticeable concern — requires attention soon' 
  },
  "worrying": { 
    bg: 'bg-amber-200', 
    text: 'text-amber-800', 
    interpretation: 'Concerning — needs active monitoring or action' 
  },
  "high": { 
    bg: 'bg-red-100', 
    text: 'text-red-700', 
    interpretation: 'Serious concern — immediate action recommended' 
  },
  "very high": { 
    bg: 'bg-rose-100', 
    text: 'text-rose-700', 
    interpretation: 'Critical — urgent and potentially dangerous situation' 
  }
};

export const ALERT_LEVEL_STYLES = {
  "mild": { 
    bg: 'bg-yellow-100', 
    text: 'text-yellow-700', 
    interpretation: 'Slight concern — monitor but not alarming' 
  },
  "moderate": { 
    bg: 'bg-orange-100', 
    text: 'text-orange-700', 
    interpretation: 'Noticeable concern — requires attention soon' 
  },
  "high": { 
    bg: 'bg-red-100', 
    text: 'text-red-700', 
    interpretation: 'Serious concern — immediate action recommended' 
  },
  "severe": { 
    bg: 'bg-rose-100', 
    text: 'text-rose-700', 
    interpretation: 'Critical — urgent and potentially dangerous situation' 
  }
};

export const getInterpretation = (risklevel) => {
    return RISK_LEVEL_STYLES[risklevel]?.interpretation
}

export function getRiskLevelBadge(riskLevel) {
    const { bg, text } = RISK_LEVEL_STYLES[riskLevel?.toLowerCase()] || RISK_LEVEL_STYLES["moderate"];
    return (
        <span className={`${bg} ${text} px-3 py-1 rounded-full text-sm font-medium`}>
            {riskLevel}
        </span>
    );
}

export function getAlertLevelBadge(alert_level) {
    const { bg, text } = ALERT_LEVEL_STYLES[alert_level?.toLowerCase()] || ALERT_LEVEL_STYLES["moderate"];
    return (
        <span className={`${bg} ${text} px-3 py-1 rounded-full text-sm font-medium`}>
            {alert_level}
        </span>
    );
}

export function getRiskLevelBadgeClass(riskLevel){
    const { bg, text } = RISK_LEVEL_STYLES[riskLevel?.toLowerCase()] || RISK_LEVEL_STYLES["moderate"];

    return `${bg} ${text}`
}





// STATUS 
export const STATUS_STYLES = {
  new: { bg: 'bg-[#F0F5EA]', text: 'text-[#669F2A]' },
  completed: { bg: 'bg-[#74D478]', text: 'text-[#0B400D]' },
  ongoing: { bg: 'bg-[#FFF0E6]', text: 'text-[#B54C00]' },
  missed: { bg: 'bg-[#F4F4F5]', text: 'text-[#6B7280]' },       // neutral gray
  cancelled: { bg: 'bg-[#FDEDED]', text: 'text-[#B91C1C]' },    // soft red background + dark red text
  awaiting_completion: { bg: 'bg-[#E6F0FA]', text: 'text-[#1D4ED8]' }
};
export const allStatus = [
  { type: 'new', title: 'new', style: STATUS_STYLES['new'] },
  { type: 'completed', title: 'completed', style: STATUS_STYLES['completed'] },
  { type: 'ongoing', title: 'on going', style: STATUS_STYLES['ongoing'] },
  { type: 'missed', title: 'missed', style: STATUS_STYLES['missed'] },
  { type: 'cancelled', title: 'cancelled', style: STATUS_STYLES['cancelled'] },
  { type: 'awaiting_completion', title: 'awaiting completion', style: STATUS_STYLES['awaiting_completion'] },
]

export const getStatusTitle = (_status) => allStatus.filter(s => s.type == _status)[0]?.title

export function getStatusBadge(status) {
    const { bg, text } = STATUS_STYLES[status] || STATUS_STYLES.new;
    return (
        <p className={`${bg} rounded-2xl px-3 py-1 ${text} text-sm font-medium w-max`}>
            {getStatusTitle(status)}
        </p>
    );
}