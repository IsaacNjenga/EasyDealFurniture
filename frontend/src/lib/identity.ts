const VISITOR_ID_KEY = 'easydeal_analytics_visitor_id';
const SESSION_ID_KEY = 'easydeal_analytics_session_id';
const LAST_ACTIVITY_KEY = 'easydeal_analytics_last_activity';

const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

export interface AnalyticsIdentity {
	visitorId: string;
	sessionId: string;
}

export function getAnalyticsIdentity(): AnalyticsIdentity {
	const now = Date.now();

	// Retrieve or create persistent visitor ID.
	let visitorId = localStorage.getItem(VISITOR_ID_KEY);

	if (!visitorId) {
		visitorId = crypto.randomUUID();
		localStorage.setItem(VISITOR_ID_KEY, visitorId);
	}

	// Retrieve current session information.
	let sessionId = localStorage.getItem(SESSION_ID_KEY) ?? '';
	const lastActivity = Number(localStorage.getItem(LAST_ACTIVITY_KEY) ?? 0);

	const sessionExpired = !sessionId || !lastActivity || now - lastActivity >= SESSION_TIMEOUT;

	// Create a new session when necessary.
	if (sessionExpired) {
		sessionId = crypto.randomUUID();
		localStorage.setItem(SESSION_ID_KEY, sessionId);
	}

	// Update activity timestamp.
	localStorage.setItem(LAST_ACTIVITY_KEY, now.toString());

	return {
		visitorId,
		sessionId
	};
}

export function clearAnalyticsIdentity(): void {
	localStorage.removeItem(VISITOR_ID_KEY);
	localStorage.removeItem(SESSION_ID_KEY);
	localStorage.removeItem(LAST_ACTIVITY_KEY);
}
