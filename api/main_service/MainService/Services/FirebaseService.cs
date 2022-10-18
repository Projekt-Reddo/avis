using FirebaseAdmin.Auth;
using MainService.Models;
using System.Data;
using System.Security.Claims;
using System.Security.Principal;

namespace MainService.Services
{
    public static class FirebaseService
    {
        public static async Task SetRoleClaim(string userUid, string role) => await SetClaim(userUid, "role", role);

        public static async Task SetNameClaim(string userUid, string name) => await SetClaim(userUid, "displayName", name);

        public static async Task SetAvatarClaim(string userUid, string avatar) => await SetClaim(userUid, "avatar", avatar);

        public static async Task SetInitiatedClaim(string userUid) => await SetClaim(userUid, "initiated", true);

        private static async Task SetClaim(string userUid, string claimType, object claimValue)
        {
            // Set admin privileges on the user corresponding to uid.
            var claims = new Dictionary<string, object>()
            {
                { claimType, claimValue },
            };

            await FirebaseAuth.DefaultInstance.SetCustomUserClaimsAsync(userUid, claims);
            // The new custom claims will propagate to the user's ID token the
            // next time a new one is issued.
        }

        public static async Task SetClaims(Account account)
        {
            // Set admin privileges on the user corresponding to uid.
            var claims = new Dictionary<string, object>()
            {
                { "role", account.Role },
                { "displayName", account.Name },
                { "avatar", account.Avatar },
                { "initiated", true },
            };

            await FirebaseAuth.DefaultInstance.SetCustomUserClaimsAsync(account.Uid, claims);
            // The new custom claims will propagate to the user's ID token the
            // next time a new one is issued.
        }
    }
}
