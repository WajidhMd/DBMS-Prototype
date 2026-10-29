import React from 'react';
import { Truck, Check, Clock, AlertTriangle, Package, Calendar, Hash } from 'lucide-react';
import './VisualTracker.css';

const ORDER_STAGES = [
  { key: 'ORDER_PLACED', label: 'Order Placed', aliases: ['PENDING', 'ORDER_PLACED', 'PENDING_EMPLOYEE'] },
  { key: 'CONFIRMED', label: 'Confirmed', aliases: ['ORDER_CONFIRMED', 'CONFIRMED'] },
  { key: 'PACKED', label: 'Packed', aliases: ['PACKED', 'SENT_TO_SELLER', 'PROCESSING'] },
  { key: 'SHIPPED', label: 'Shipped', aliases: ['SHIPPED', 'IN_TRANSIT'] },
  { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', aliases: ['OUT_FOR_DELIVERY'] },
  { key: 'DELIVERED', label: 'Delivered', aliases: ['DELIVERED'] }
];

const RETURN_STAGES = [
  { key: 'RETURN_REQUESTED', label: 'Return Requested', aliases: ['RETURN_REQUESTED'] },
  { key: 'RETURN_APPROVED', label: 'Employee Approval', aliases: ['RETURN_APPROVED'] },
  { key: 'RETURN_SHIPPED', label: 'Return Shipment Initiated', aliases: ['RETURN_SHIPPED'] },
  { key: 'RETURN_IN_TRANSIT', label: 'Return In Transit', aliases: ['RETURN_IN_TRANSIT'] },
  { key: 'RETURN_RECEIVED', label: 'Return Received by Seller', aliases: ['RETURN_RECEIVED'] },
  { key: 'RETURN_COMPLETED', label: 'Return Completed', aliases: ['RETURN_COMPLETED'] }
];

export default function VisualTracker({
  type = 'order', // 'order' | 'return'
  status = '',
  history = [],
  courierName = null,
  trackingNumber = null,
  orderNumber = null,
  returnId = null,
  approxDeliveryDate = null,
  rejectionReason = null
}) {
  const isReturn = type === 'return';
  const stages = isReturn ? RETURN_STAGES : ORDER_STAGES;

  const upperStatus = (status || '').toUpperCase().trim();
  const isRejected = isReturn && upperStatus === 'RETURN_REJECTED';
  const isCancelled = upperStatus.includes('CANCEL');

  // Determine current stage index based on exact status matches
  let currentStageIndex = 0;
  for (let i = stages.length - 1; i >= 0; i--) {
    if (stages[i].aliases.some(alias => upperStatus === alias || upperStatus.includes(alias))) {
      currentStageIndex = i;
      break;
    }
  }

  // Calculate percentage along the bar for progress line and truck
  const totalStages = stages.length;
  const progressPercent = (currentStageIndex / (totalStages - 1)) * 100;

  // Extract timestamps from history
  const getStageTimestamp = (stage) => {
    if (!history || history.length === 0) return null;
    const match = history.find(h => {
      const hStatus = (h.status || h.new_status || h.action || '').toUpperCase();
      return stage.aliases.some(alias => hStatus.includes(alias));
    });
    return match ? (match.timestamp || match.created_at || '').substring(0, 16) : null;
  };

  return (
    <div className="tracker-container">
      {/* Header Info */}
      <div className="tracker-header">
        <div className="tracker-title">
          <Truck size={20} color="var(--accent-purple)" />
          <span>{isReturn ? 'Return Shipment Live Tracking' : 'Order Delivery Progress'}</span>
          {isRejected && <span className="badge badge-danger">Rejected</span>}
          {isCancelled && <span className="badge badge-warning">Cancelled</span>}
        </div>

        <div className="tracker-meta">
          {orderNumber && (
            <div className="tracker-meta-item">
              <Hash size={13} />
              <span>Order: <strong>{orderNumber}</strong></span>
            </div>
          )}

          {returnId && (
            <div className="tracker-meta-item">
              <Hash size={13} />
              <span>Return ID: <strong>{returnId}</strong></span>
            </div>
          )}

          {courierName && (
            <div className="tracker-meta-item">
              <Package size={13} />
              <span>Courier: <strong>{courierName}</strong></span>
            </div>
          )}

          {trackingNumber && (
            <div className="tracker-meta-item">
              <span>Tracking: <strong>{trackingNumber}</strong></span>
            </div>
          )}

          {approxDeliveryDate && (
            <div className="tracker-meta-item" style={{ color: 'var(--accent-green)' }}>
              <Calendar size={13} />
              <span>Estimated: <strong>{approxDeliveryDate}</strong></span>
            </div>
          )}
        </div>
      </div>

      {isRejected && rejectionReason && (
        <div style={{
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          color: '#f87171',
          padding: '0.75rem 1rem',
          borderRadius: 'var(--radius-md)',
          fontSize: '0.88rem',
          marginBottom: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <AlertTriangle size={18} />
          <span><strong>Rejection Reason:</strong> {rejectionReason}</span>
        </div>
      )}

      {/* Progress Line & Moving Truck Track */}
      <div className="timeline-track-wrapper">
        <div className="timeline-base-line" />
        <div
          className="timeline-progress-line"
          style={{ width: `${progressPercent}%` }}
        />

        {/* Moving Truck Carrier */}
        {!isRejected && (
          <div
            className="truck-carrier"
            style={{ left: `${progressPercent}%` }}
            title={`Current Location: ${stages[currentStageIndex]?.label}`}
          >
            <div className="truck-bubble">
              <Truck size={18} />
            </div>
            <span className="truck-label-live">Live</span>
          </div>
        )}

        {/* Stage Nodes */}
        <div className="timeline-stages">
          {stages.map((stage, idx) => {
            const isCompleted = idx < currentStageIndex;
            const isCurrent = idx === currentStageIndex;
            const isUpcoming = idx > currentStageIndex;
            const stageTime = getStageTimestamp(stage);

            let statusClass = 'upcoming';
            if (isRejected && idx === 1) statusClass = 'rejected';
            else if (isCompleted) statusClass = 'completed';
            else if (isCurrent) statusClass = 'current';

            return (
              <div key={stage.key} className={`timeline-stage ${statusClass}`}>
                <div className="stage-node">
                  {isCompleted ? (
                    <Check size={18} strokeWidth={3} />
                  ) : isCurrent ? (
                    <span>{idx + 1}</span>
                  ) : (
                    <span>{idx + 1}</span>
                  )}
                </div>
                <span className="stage-label">{stage.label}</span>
                {stageTime && <span className="stage-timestamp">{stageTime}</span>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
