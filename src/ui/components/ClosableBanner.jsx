import React, {useState} from 'react';

const ClosableBanner = ({title, message}) => {
    const [isVisible, setIsVisible] = useState(true);

    const handleClose = () => {
        setIsVisible(false);
    };

    if (!isVisible) {
        return null;
    }

    const bannerStyle = {
        backgroundColor: '#fff3cd',
        color: '#856404',
        padding: '10px 20px',
        border: '1px solid #ffeeba',
        borderRadius: '4px',
        display: 'flex',
        flexDirection: 'column',
    };

    const headerStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '5px'
    };

    const titleStyle = {
        fontWeight: 'bold',
        marginBottom: '5px'
    };

    const messageStyle = {
        flexGrow: 1
    };

    const closeButtonStyle = {
        background: 'none',
        border: 'none',
        fontSize: '20px',
        fontWeight: 'bold',
        color: '#0c5460',
        cursor: 'pointer',
        outline: 'none',
        alignSelf: 'flex-end'
    };

    return (
        <div style={bannerStyle}>
            <div style={headerStyle}>
                <div style={titleStyle}>EMBL-EBI User Survey 2024</div>
                <button style={closeButtonStyle} onClick={handleClose}>
                    &times;
                </button>
            </div>
            <div style={messageStyle}>
                Do data resources managed by EMBL-EBI and our collaborators make a difference to your work?
                <br/><strong> Please take 10 minutes to <a
                href="https://www.surveymonkey.com/r/HJKYKTT?channel=[webpage]"
                target="_blank"
                rel="noreferrer">fill in our annual user survey</a></strong>,
                and help us make the case for why sustaining open data resources is critical for life sciences research.
            </div>
        </div>
    );
};

export default ClosableBanner;
