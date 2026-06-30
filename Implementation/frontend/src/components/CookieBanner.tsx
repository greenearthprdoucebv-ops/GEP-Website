import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import './CookieBanner.css';

type ConsentAction = 'accept_all' | 'reject_all' | 'customize';

// Consent logging is anonymous (no user account required), so we key rows by a
// random client-generated device ID persisted in localStorage rather than a user ID.
function getDeviceId(): string {
  let id = localStorage.getItem('gep_device_id');
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem('gep_device_id', id);
  }
  return id;
}

async function logConsentToDb(
  action: ConsentAction,
  choices: { necessary: boolean; analytics: boolean; marketing: boolean },
) {
  if (!supabase) return;
  await supabase.from('cookie_consents').insert({
    device_id:  getDeviceId(),
    necessary:  choices.necessary,
    analytics:  choices.analytics,
    marketing:  choices.marketing,
    action,
    user_agent: navigator.userAgent,
  });
}

type Locale = 'en' | 'nl' | 'zh';

export interface CookieBannerProps {
  locale?: Locale;
  privacyPolicyUrl?: string;
}

const translations = {
  en: {
    title: 'We Use Cookies',
    description:
      'We use cookies to keep the site running and to understand how it is used. Some cookies are also used for marketing. You can accept all, reject all, or choose individually.',
    acceptAll: 'Accept All',
    rejectAll: 'Reject All',
    customize: 'Customize',
    privacyPolicy: 'Privacy Policy',
    cookieSettings: 'Cookie Settings',
    modalTitle: 'Cookie Preferences',
    modalDescription:
      'Manage your cookie preferences below. Necessary cookies keep the site working and cannot be turned off.',
    alwaysOn: 'Always on',
    savePreferences: 'Save Preferences',
    cancel: 'Cancel',
    languageLabel: 'Language',
    categories: {
      necessary: {
        label: 'Necessary',
        description:
          'Required for the site to work. Includes session cookies, login state, and language preference. Cannot be disabled.',
      },
      analytics: {
        label: 'Analytics',
        description:
          'Helps us understand how visitors use the site by collecting anonymous usage data (e.g. Google Analytics). No personal data is stored.',
      },
      marketing: {
        label: 'Marketing',
        description:
          'Used for personalised advertising and conversion tracking on platforms such as Facebook Pixel and LinkedIn Insight Tag.',
      },
    },
  },
  nl: {
    title: 'Wij Gebruiken Cookies',
    description:
      'Wij gebruiken cookies om de website te laten werken en het gebruik te analyseren. Sommige cookies worden ook voor marketingdoeleinden gebruikt. U kunt alles accepteren, weigeren of individueel kiezen.',
    acceptAll: 'Alles accepteren',
    rejectAll: 'Alles weigeren',
    customize: 'Aanpassen',
    privacyPolicy: 'Privacybeleid',
    cookieSettings: 'Cookie-instellingen',
    modalTitle: 'Cookievoorkeuren',
    modalDescription:
      'Beheer hieronder uw cookievoorkeuren. Noodzakelijke cookies zijn vereist voor een correcte werking van de website en kunnen niet worden uitgeschakeld.',
    alwaysOn: 'Altijd aan',
    savePreferences: 'Voorkeuren opslaan',
    cancel: 'Annuleren',
    languageLabel: 'Taal',
    categories: {
      necessary: {
        label: 'Noodzakelijk',
        description:
          'Vereist voor het functioneren van de website. Omvat sessiecookies, inlogstatus en taalvoorkeur. Kan niet worden uitgeschakeld.',
      },
      analytics: {
        label: 'Analytisch',
        description:
          'Helpt ons te begrijpen hoe bezoekers de website gebruiken via anonieme gebruiksgegevens (bijv. Google Analytics). Er worden geen persoonsgegevens opgeslagen.',
      },
      marketing: {
        label: 'Marketing',
        description:
          'Gebruikt voor gepersonaliseerde advertenties en conversietracking via platforms zoals Facebook Pixel en LinkedIn Insight Tag.',
      },
    },
  },
  zh: {
    title: '我们使用Cookie',
    description:
      '我们使用Cookie维持网站正常运行和分析使用情况，部分Cookie用于营销目的。您可以全部接受、全部拒绝，或分别选择。',
    acceptAll: '全部接受',
    rejectAll: '全部拒绝',
    customize: '自定义设置',
    privacyPolicy: '隐私政策',
    cookieSettings: 'Cookie设置',
    modalTitle: 'Cookie偏好设置',
    modalDescription:
      '请在下方管理您的Cookie偏好。必要Cookie是网站正常运行所必需的，无法禁用。',
    alwaysOn: '始终开启',
    savePreferences: '保存偏好',
    cancel: '取消',
    languageLabel: '语言',
    categories: {
      necessary: {
        label: '必要',
        description:
          '网站正常运行所必需，包括会话Cookie、登录状态和语言偏好，无法禁用。',
      },
      analytics: {
        label: '分析',
        description:
          '通过收集匿名使用数据帮助我们了解访客如何使用网站（如Google Analytics），不存储个人数据。',
      },
      marketing: {
        label: '营销',
        description:
          '用于个性化广告和跨平台转化跟踪，如Facebook像素和LinkedIn Insight标签。',
      },
    },
  },
};

function CookieToggle({
  label,
  checked,
  disabled,
  onChange,
}: {
  label: string;
  checked: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
}) {
  return (
    <label className="cookie-toggle" aria-label={label}>
      <input
        type="checkbox"
        disabled={disabled}
        // The "necessary" category is always-on and never changes, so it's rendered
        // uncontrolled (defaultChecked) instead of controlled (checked) — React warns
        // if a disabled checkbox is given `checked` without a matching `onChange`.
        {...(disabled ? { defaultChecked: checked } : { checked })}
        onChange={(e) => onChange?.(e.target.checked)}
      />
      <span className="cookie-toggle__slider" />
    </label>
  );
}

function CookieCategoryRow({
  name,
  description,
  children,
}: {
  name: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="cookie-category">
      <div className="cookie-category__header">
        <span className="cookie-category__name">{name}</span>
        {children}
      </div>
      <p className="cookie-category__description">{description}</p>
    </div>
  );
}

export default function CookieBanner({
  locale: localeProp = 'en',
  privacyPolicyUrl = '/privacy-policy',
}: CookieBannerProps) {
  const [visible, setVisible] = useState(() => !localStorage.getItem('gep_cookie_seen'));
  const [showFloating, setShowFloating] = useState(() => !!localStorage.getItem('gep_cookie_seen'));
  const [showModal, setShowModal] = useState(false);
  const [locale, setLocale] = useState<Locale>(localeProp);
  const [preferences, setPreferences] = useState({ analytics: false, marketing: false });

  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const t = translations[locale];

  useEffect(() => {
    const show = () => { setShowFloating(false); setVisible(true); };
    window.addEventListener('gep:show-cookie-banner', show);
    return () => window.removeEventListener('gep:show-cookie-banner', show);
  }, []);

  useEffect(() => {
    // Small delay so focus moves to the close button only after the modal has
    // actually mounted/painted, rather than racing the render.
    if (showModal) {
      const id = setTimeout(() => closeButtonRef.current?.focus(), 40);
      return () => clearTimeout(id);
    }
  }, [showModal]);

  // Keeps keyboard focus cycling within the modal (WAI-ARIA dialog pattern) and
  // closes it on Escape, since there's no <dialog> element doing this natively.
  const handleModalKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Escape') { setShowModal(false); return; }
      if (e.key === 'Tab' && modalRef.current) {
        const focusable = Array.from(
          modalRef.current.querySelectorAll<HTMLElement>(
            'button:not([disabled]), [href], input:not([disabled]), [tabindex]:not([tabindex="-1"])',
          ),
        );
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault(); last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault(); first.focus();
        }
      }
    },
    [],
  );

  function dismiss(action: ConsentAction, analytics: boolean, marketing: boolean) {
    localStorage.setItem('gep_cookie_seen', '1');
    setVisible(false);
    setShowFloating(true);
    logConsentToDb(action, { necessary: true, analytics, marketing });
  }

  if (!visible && !showFloating) return null;

  return (
    <>
      {showFloating && !visible && (
        <button
          type="button"
          className="cookie-floating-btn"
          onClick={() => { setShowFloating(false); setVisible(true); }}
          aria-label={t.cookieSettings}
          title={t.cookieSettings}
        >
          <span className="cookie-floating-btn__icon" aria-hidden="true">🍪</span>
          <span className="cookie-floating-btn__text">{t.cookieSettings}</span>
        </button>
      )}

      {visible && (
        <div
          className="cookie-banner"
          role="region"
          aria-label={t.title}
          aria-live="polite"
        >
          <div className="cookie-banner__inner">
            <div className="cookie-banner__text">
              <p className="cookie-banner__title">{t.title}</p>
              <p className="cookie-banner__description">
                {t.description}{' '}
                <a
                  href={privacyPolicyUrl}
                  className="cookie-banner__link"
                  {...(privacyPolicyUrl.startsWith('http')
                    ? { target: '_blank', rel: 'noopener noreferrer' }
                    : {})}
                >
                  {t.privacyPolicy}
                </a>
              </p>
            </div>

            <div className="cookie-banner__controls">
              <div className="cookie-banner__lang" role="group" aria-label={t.languageLabel}>
                {(['en', 'nl', 'zh'] as Locale[]).map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    className={`cookie-lang-btn${locale === lang ? ' active' : ''}`}
                    onClick={() => setLocale(lang)}
                    aria-pressed={locale === lang}
                  >
                    {lang.toUpperCase()}
                  </button>
                ))}
              </div>

              <div className="cookie-banner__actions">
                <button
                  type="button"
                  className="cookie-btn cookie-btn--reject"
                  onClick={() => dismiss('reject_all', false, false)}
                >
                  {t.rejectAll}
                </button>
                <button
                  type="button"
                  className="cookie-btn cookie-btn--customize"
                  onClick={() => setShowModal(true)}
                >
                  {t.customize}
                </button>
                <button
                  type="button"
                  className="cookie-btn cookie-btn--accept"
                  onClick={() => dismiss('accept_all', true, true)}
                >
                  {t.acceptAll}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <div
          className="cookie-modal-overlay"
          role="presentation"
          onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="cookie-modal-title"
            className="cookie-modal"
            ref={modalRef}
            onKeyDown={handleModalKeyDown}
          >
            <div className="cookie-modal__header">
              <h2 id="cookie-modal-title" className="cookie-modal__title">
                {t.modalTitle}
              </h2>
              <button
                ref={closeButtonRef}
                type="button"
                className="cookie-modal__close"
                onClick={() => setShowModal(false)}
                aria-label="Close cookie preferences"
              >
                ✕
              </button>
            </div>

            <p className="cookie-modal__description">{t.modalDescription}</p>

            <CookieCategoryRow
              name={t.categories.necessary.label}
              description={t.categories.necessary.description}
            >
              <div className="cookie-category__meta">
                <span className="cookie-category__always-on">{t.alwaysOn}</span>
                <CookieToggle label={t.categories.necessary.label} checked disabled />
              </div>
            </CookieCategoryRow>

            {(['analytics', 'marketing'] as const).map((key) => (
              <CookieCategoryRow key={key} name={t.categories[key].label} description={t.categories[key].description}>
                <CookieToggle
                  label={t.categories[key].label}
                  checked={preferences[key]}
                  onChange={(checked) => setPreferences((p) => ({ ...p, [key]: checked }))}
                />
              </CookieCategoryRow>
            ))}

            <div className="cookie-modal__footer">
              <button
                type="button"
                className="cookie-btn cookie-btn--customize"
                onClick={() => setShowModal(false)}
              >
                {t.cancel}
              </button>
              <button
                type="button"
                className="cookie-btn cookie-btn--accept"
                onClick={() => { setShowModal(false); dismiss('customize', preferences.analytics, preferences.marketing); }}
              >
                {t.savePreferences}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
