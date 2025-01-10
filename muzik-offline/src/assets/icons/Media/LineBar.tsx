const LineBar = () => {
    return (
        <svg width="150" height="100" viewBox="0 0 150 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="5" y="49" width="140" height="2" rx="1" fill="#ECECEC"/>
            <rect x="5" y="49" width="84.4" height="2" rx="1" fill="#FBFD9F" className="fill_this"/>
            <circle cx="91.2" cy="50" r="3" fill="#FBFD9F" className="fill_this"/>
            <circle cx="91.2" cy="50" r="3.5" stroke="#B6B6B6" stroke-opacity="0.2"/>
        </svg>
    )
}

export default LineBar