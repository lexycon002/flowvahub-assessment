import React from "react";

function RewardCard({
  reward,
  onRedeem,
  userPoints = 0,
  loading = false,
}) {
  const pointsRequired = reward?.points_required ?? 0;
  const comingSoon = pointsRequired === 0;
  const canRedeem = !comingSoon && userPoints >= pointsRequired;

  return (
    <div
      className={`bg-white w-full rounded-xl border p-6 shadow-sm flex flex-col text-center transition
        ${
          comingSoon
            ? "border-slate-200 opacity-70"
            : canRedeem
            ? "border-violet-200"
            : "border-slate-200"
        }
      `}
    >
      {/* Image */}
      <div className="w-8 h-8 mx-auto mb-4 rounded-lg bg-violet-50 flex items-center justify-center overflow-hidden">
        {reward?.image_url ? (
          <img
            src={reward.image_url}
            alt={reward.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-8 h-8 bg-violet-100 rounded" />
        )}
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-slate-800 mb-2">
        {reward?.title}
      </h3>

      {/* Description */}
      <p className="text-sm text-slate-500 mb-4">
        {reward?.description}
      </p>

      {/* Points */}
      <div className="flex items-center justify-center gap-2 text-sm mb-5">
        <span className="text-violet-600 font-semibold"> ⭐ 
          {pointsRequired} pts
        </span>
      </div>

      {/* Action button */}
      <button
        onClick={() => onRedeem?.(reward)}
        disabled={!canRedeem || loading || comingSoon}
        className={`w-full py-3 rounded-lg font-medium transition
          ${
            comingSoon
              ? "bg-slate-100 text-slate-400 cursor-not-allowed"
              : loading
              ? "bg-violet-400 text-white cursor-wait"
              : canRedeem
              ? "bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white hover:opacity-95"
              : "bg-slate-100 text-slate-400 cursor-not-allowed"
          }
        `}
      >
        {comingSoon
          ? "Coming Soon"
          : loading
          ? "Processing…"
          : canRedeem
          ? "Redeem"
          : "Locked"}
      </button>
    </div>
  );
}

export default RewardCard;