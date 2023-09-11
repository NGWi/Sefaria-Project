import React, {useState} from "react";
import Sefaria  from './sefaria/sefaria';
import $  from './sefaria/sefariaJquery';
import {
    CloseButton, InterfaceText, EnglishText, HebrewText
} from './Misc';

export const TranslationLanguagePreferenceSuggestionBanner = ({ setTranslationLanguagePreference }) => {
    const [accepted, setAccepted] = useState(false);

    const cookie = Sefaria._inBrowser ? $.cookie : Sefaria.util.cookie;
    const { translation_language_preference_suggestion } = Sefaria;
    if ((!accepted && cookie("translation_language_preference_suggested")) || !translation_language_preference_suggestion) {
        return null;
    }
    const reject = () => {
        cookie("translation_language_preference_suggested", JSON.stringify(1), {path: "/"});
        Sefaria.editProfileAPI({settings: {translation_language_preference_suggested: true}});
    }
    const accept = () => {
        setAccepted(true);
        setTranslationLanguagePreference(translation_language_preference_suggestion);
    }
    const lang = Sefaria.translateISOLanguageCode(translation_language_preference_suggestion);
    const textElement = accepted ? (
        <InterfaceText>
            <EnglishText> Thanks! We'll show you {lang} translations first when we have them. </EnglishText>
            <HebrewText>תודה! כשנוכל, נציג לכם תרגומים בשפה ה<span className="bold">{Sefaria._(lang)}</span> כאשר אלו יהיו זמינים. </HebrewText>
        </InterfaceText>
    ) : (
        <InterfaceText>
            <EnglishText> Prefer to see <span className="bold"> {lang} </span> translations when available? </EnglishText>
            <HebrewText>האם תעדיפו לראות תרגומים בשפה ה<span className="bold">{Sefaria._(lang)}</span> כאשר הם זמינים?</HebrewText>
        </InterfaceText>
    );
    const buttons = accepted ? null : [{text: "Yes", onClick: accept}, {text: "No", onClick: reject, sideEffect: "close" }];

    return (
        <TextColumnBanner textElement={textElement} buttons={buttons} onClose={reject}/>
    );
}



/**
 * Banner which appears right above text column and informs a user of an action they can take
 * @param textElement: React element to display the call-to-action text.
 * @param buttons: List of objects. Each object should have keys "text" and "onClick". Can optionally have key "sideEffect" whose value can be "close" if the button should close the banner.
 * @param onClose: Optional callback that gets called when the banner is closed.
 * @returns {JSX.Element|null}
 * @constructor
 */
const TextColumnBanner = ({ textElement, buttons, onClose }) => {
    const [closed, setClosed] = useState(false);
    const closeBanner = () => {
        setClosed(true);
        onClose?.();
    };
    if (closed) { return null; }
    return (
        <div className="readerControls transLangPrefSuggBann">
            <div className="readerControlsInner transLangPrefSuggBannInner sans-serif">
                <div className="transLangPrefCentered">
                    { textElement }
                    <div className="yesNoGroup">
                        { buttons.map(button => <TextColumnBannerButton key={button.text} button={button} setBannerClosed={setClosed}/>) }
                    </div>
                </div>
                <CloseButton onClick={closeBanner} />
            </div>
        </div>
    );
}

const TextColumnBannerButton = ({ button, setBannerClosed }) => {
    const onClick = () => {
        button.onClick();
        if (button.sideEffect === "close") { setBannerClosed(true); }
    }
    return (
        <a className="yesNoButton" onClick={onClick}>
            <InterfaceText>{button.text}</InterfaceText>
        </a>
    );
}
