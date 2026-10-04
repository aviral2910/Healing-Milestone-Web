import Link from 'next/link';
import AuthAwareLogo from '@/components/AuthAwareLogo';


export default function AppBar() {
  return (
    <header className="banner">
      <AuthAwareLogo />
    </header>
  );
}
