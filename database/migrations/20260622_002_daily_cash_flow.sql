-- PuntoVenta daily cash flow model.
-- Target dialect: Azure SQL / SQL Server.
-- Local-review only for TASK-029; do not run against SQL Server local or Azure SQL without an explicit execution task.

SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;

BEGIN TRANSACTION;

ALTER TABLE dbo.cash_shifts
ADD
    opening_note NVARCHAR(160) NULL,
    closing_note NVARCHAR(240) NULL,
    card_reported_amount DECIMAL(18,2) NULL,
    transfer_reported_amount DECIMAL(18,2) NULL,
    other_reported_amount DECIMAL(18,2) NULL,
    high_difference_threshold_amount DECIMAL(18,2) NOT NULL
        CONSTRAINT DF_cash_shifts_high_difference_threshold DEFAULT (1000);

ALTER TABLE dbo.cash_movements
ADD
    signed_amount DECIMAL(18,2) NULL,
    adjustment_direction NVARCHAR(20) NULL,
    reference NVARCHAR(120) NULL;

GO

UPDATE dbo.cash_movements
SET signed_amount = CASE
    WHEN movement_type IN ('cash_out', 'closing_adjustment') THEN -amount
    ELSE amount
END
WHERE signed_amount IS NULL;

GO

ALTER TABLE dbo.cash_movements
ALTER COLUMN signed_amount DECIMAL(18,2) NOT NULL;

ALTER TABLE dbo.cash_shifts
ADD CONSTRAINT CK_cash_shifts_reported_amounts_nonnegative CHECK (
    (card_reported_amount IS NULL OR card_reported_amount >= 0)
    AND (transfer_reported_amount IS NULL OR transfer_reported_amount >= 0)
    AND (other_reported_amount IS NULL OR other_reported_amount >= 0)
    AND high_difference_threshold_amount >= 0
);

ALTER TABLE dbo.cash_shifts
ADD CONSTRAINT CK_cash_shifts_close_fields CHECK (
    (
        status = 'open'
        AND closed_at IS NULL
        AND closed_by_user_id IS NULL
        AND counted_cash_amount IS NULL
        AND expected_cash_amount IS NULL
        AND difference_amount IS NULL
    )
    OR
    (
        status IN ('closed', 'void')
        AND closed_at IS NOT NULL
        AND closed_by_user_id IS NOT NULL
        AND counted_cash_amount IS NOT NULL
        AND expected_cash_amount IS NOT NULL
        AND difference_amount IS NOT NULL
    )
);

ALTER TABLE dbo.cash_movements
DROP CONSTRAINT CK_cash_movements_type;

ALTER TABLE dbo.cash_movements
ADD CONSTRAINT CK_cash_movements_type CHECK (
    movement_type IN ('opening', 'sale_cash_payment', 'cash_in', 'cash_out', 'cash_adjustment', 'closing_adjustment')
);

ALTER TABLE dbo.cash_movements
ADD CONSTRAINT CK_cash_movements_signed_amount CHECK (signed_amount <> 0);

ALTER TABLE dbo.cash_movements
ADD CONSTRAINT CK_cash_movements_adjustment_direction CHECK (
    adjustment_direction IS NULL OR adjustment_direction IN ('increase', 'decrease')
);

ALTER TABLE dbo.cash_movements
ADD CONSTRAINT CK_cash_movements_reason_required CHECK (
    movement_type NOT IN ('cash_in', 'cash_out', 'cash_adjustment', 'closing_adjustment')
    OR (reason IS NOT NULL AND LEN(LTRIM(RTRIM(reason))) > 0)
);

CREATE UNIQUE INDEX UX_cash_shifts_company_terminal_open
ON dbo.cash_shifts(company_id, terminal_id)
WHERE status = 'open';

CREATE INDEX IX_cash_shifts_company_terminal_status_opened
ON dbo.cash_shifts(company_id, terminal_id, status, opened_at);

CREATE INDEX IX_cash_movements_company_shift_type_created
ON dbo.cash_movements(company_id, cash_shift_id, movement_type, created_at);

COMMIT TRANSACTION;
