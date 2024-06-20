import React, {useState, useEffect} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {library} from '@fortawesome/fontawesome-svg-core';
import {faArrowUp} from '@fortawesome/free-solid-svg-icons'
import "../assets/css/upperPage.css";

library.add(faArrowUp);


const UpperPage = ({fr}) => {
    const [isVisible, setIsVisible] = useState(false);
    useEffect(() => {
        const toggleVisibility = () => {
            if (window.pageYOffset > 300)  setIsVisible(true);
            else setIsVisible(false);
            if (fr.current) {
                const footerPosition = fr.current.getBoundingClientRect().top;
                if (footerPosition < window.innerHeight) {
                    setIsVisible(false);
                }
            }
        };
        window.addEventListener('scroll', toggleVisibility);
        return () => {
            window.removeEventListener('scroll', toggleVisibility);
        };
    }, []);


    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <div className="scroll-to-top">
            {isVisible && (
                <button onClick={scrollToTop}>
                    <FontAwesomeIcon icon={faArrowUp} />
                </button>
            )}
        </div>
    );
};

export default UpperPage;