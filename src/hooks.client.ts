import { dev } from '$app/environment';
import { env } from '$env/dynamic/public';
import type { HandleClientError } from '@sveltejs/kit';
import posthog from 'posthog-js';

export function init() {
	const token = env.PUBLIC_POSTHOG_PROJECT_TOKEN;
	if (!token) {
		if (dev) {
			throw new Error(
				'PUBLIC_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once PUBLIC_POSTHOG_PROJECT_TOKEN is configured'
			);
		}
		return;
	}

	const host = env.PUBLIC_POSTHOG_HOST;
	if (!host) {
		if (dev) {
			throw new Error(
				'PUBLIC_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once PUBLIC_POSTHOG_HOST is configured'
			);
		}
		return;
	}

	posthog.init(token, {
		api_host: host,
		logs: {
			serviceName: 'darkest-companion-web',
			environment: dev ? 'development' : 'production'
		},
		capture_exceptions: {
			capture_unhandled_errors: true,
			capture_unhandled_rejections: true,
			capture_console_errors: false
		}
	});
}

export const handleError: HandleClientError = ({ error, status }) => {
	if (status !== 404) {
		posthog.captureException(error);
	}
};
