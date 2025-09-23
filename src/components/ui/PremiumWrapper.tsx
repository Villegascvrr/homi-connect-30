import React from 'react';
import { useNavigate } from 'react-router-dom';

type PremiumWrapperProps = {
  isSuscriptor: boolean;
  children: React.ReactNode;
  className?: string;
};

const PremiumWrapper: React.FC<PremiumWrapperProps> = ({
  isSuscriptor,
  children,
  className,
}) => {
  const navigate = useNavigate();

  const handlePremiumClick = () => {
    navigate('/precios');
  };

  if (isSuscriptor) {
    return <>{children}</>;
  }

  return (
    <div className={`relative ${className}`} onClick={handlePremiumClick}>
      {children}
      <div className="absolute inset-0 z-10 cursor-pointer bg-transparent" />
    </div>
  );
};

export default PremiumWrapper;
