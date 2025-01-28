import React from 'react';
import { FacebookShareButton, TwitterShareButton, FacebookIcon, TwitterIcon } from 'react-share';

const ShareResults = ({ profile }) => {
    const shareUrl = "http://yourapp.com"; // Replace with your app URL
    const shareText = `Check out my personality results: ${JSON.stringify(profile)}`;

    return (
        <div>
            <h3 className='mt-12 text-center'>Share your results!</h3>
            <div className='flex justify-center '>
                <div className='flex space-x-4'>
                    <FacebookShareButton url={shareUrl} quote={shareText}>
                        <FacebookIcon size={32} round />
                    </FacebookShareButton>
                    <TwitterShareButton url={shareUrl} title={shareText}>
                        <TwitterIcon size={32} round />
                    </TwitterShareButton>
                </div>
            </div>
        </div>
    );
};

export default ShareResults;