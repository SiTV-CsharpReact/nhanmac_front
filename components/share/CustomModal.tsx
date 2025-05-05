import { Modal, ModalProps } from 'antd';
import React from 'react';

interface CustomModalProps extends ModalProps {
  children: React.ReactNode;
  className?: string;
  // open và onCancel đã được kế thừa từ ModalProps
  // open: boolean;
  onCancel?: (e: React.MouseEvent<HTMLElement>) => void;
}

const CustomModal: React.FC<CustomModalProps> = ({
  children,
  className = '',
  footer = null, // Mặc định không hiển thị footer
  ...modalProps
}) => {
  return (
    <Modal
    style={{ top: 40 }}
      {...modalProps}
      className={`custom-modal ${className}`}
      footer={footer}
      // onCancel={() => onCancel(false)} // Xử lý đóng modal
    >
      <div className="modal-content">
        {children}
      </div>
    </Modal>
  );
};

export default CustomModal;