import { useState } from 'react';
import styles from './PasswordModal.module.css';

export default function PasswordModal({ isOpen, onClose, onConfirm, title }) {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (event) => {
    event.preventDefault();
    onConfirm(password);
    setPassword('');
  };
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h3>{title}</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            className={styles.passwordInput}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호를 입력하세요"
            autoFocus
          />
          <div className={styles.buttonGroup}>
            <button type="button" onClick={onClose} disabled={isLoading}>
              취소
            </button>
            <button type="submit" disabled={isLoading || !password}>
              {isLoading ? '확인 중...' : '확인'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
