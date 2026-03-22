/**
 * API istekleri — httpOnly JWT çerezinin tarayıcıdan gönderilmesi için credentials: "include".
 */
export function apiFetch(input, init = {}) {
	return fetch(input, {
		...init,
		credentials: "include",
	});
}
