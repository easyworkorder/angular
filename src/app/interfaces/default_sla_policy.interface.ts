export interface ISLAPolicy {
    company: string;
    name: string;
    description: string;
}

export interface ISLAPolicyTarget {
    sla: string;
    priority: string;
    respond_within: string;
    respond_within_unit: string;
    resolve_within: string;
    resolve_within_unit: string;
    operational_hours: string;
    escalation_email: boolean;
}
