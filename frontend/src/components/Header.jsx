import "./Header.css"
import { useTranslation } from "react-i18next"

export function Header() {
  const { t } = useTranslation();
  return (
    <header className="header-catalog">
      <h1>{t('header.catalog')}</h1>
    </header>
  )
}
