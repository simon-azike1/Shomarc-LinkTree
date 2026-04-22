le# Task: Fix Profile Creation/Update Issues (Keep Single-Profile Design)

## Completed: [3/6]

✅ Step 1: Analyzed all relevant files and confirmed issues  
✅ Step 2: Created plan for single-profile fixes  

## Plan Breakdown:

**Issue Confirmed**:  
- Single global profile in backend/server.js  
- `handleCreateUser` fails on 2nd+ attempt (POST checks existing → 400)  
- `loadUser()`/`handleUpdateUser` work fine  
- Error handling already good  

**Fixes**:  
1. Update backend/server.js POST /api/profile → always create/update (merge POST+PUT logic)  
2. Minor: Frontend name → displayName consistency (if needed)  
3. Test flows  

✅ **Step 3**: Edit backend/server.js POST /api/profile handler (now always create/update)

⏳ **Step 4**: Test POST after profile exists  

⏳ **Step 5**: Test PUT /api/profile directly  

⏳ **Step 6**: Verify frontend flows + attempt_completion  

**Next**: Test the fix (start backend/frontend servers, try create twice + PUT curl)

