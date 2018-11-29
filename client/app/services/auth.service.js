"use strict";

angular
  .module("app")
  .factory("Auth", function Auth(
    $location,
    $rootScope,
    $state,
    $stateParams,
    $http,
    $cookieStore,
    $cookies,
    $q,
    User
  ) {
    var currentUser = {};
    if ($cookieStore.get("token")) {
      currentUser = User.get();
    }
    var auth = {
      /**
       * Authenticate user and save token
       *
       * @param  {Object}   user     - login info
       * @param  {Function} callback - optional
       * @return {Promise}
       */
      login: function(user, callback) {
        var cb = callback || angular.noop;
        var deferred = $q.defer();
        $http
          .post("/auth/local", user)
          .success(function(data) {
            $cookieStore.put('token', data.token, { secure: true });
            currentUser = User.get();
            deferred.resolve(data);
            return cb();
          })
          .error(
            function(err) {
              this.logout();
              deferred.reject(err);
              return cb(err);
            }.bind(this)
          );

        return deferred.promise;
      },

      /**
       * Logout user
       *
       * @param  {Function}
       */
      logout: function() {
        User.logout();
        currentUser = {};
      },

      /**
       * Gets all available info on authenticated user
       *
       * @return {Object} user
       */
      getCurrentUser: function() {
        console.log(currentUser);
        return currentUser;
      },

      /**
       * Check if a user is logged in
       *
       * @return {Boolean}
       */
      isLoggedIn: function() {
        return currentUser.hasOwnProperty("role");
      },

      /**
       * Waits for currentUser to resolve before checking if user is logged in
       */
      isLoggedInAsync: function(cb) {
        if (currentUser.hasOwnProperty("$promise")) {
          currentUser.$promise
            .then(function() {
              cb(true);
            })
            .catch(function() {
              cb(false);
            });
        } else if (currentUser.hasOwnProperty("role")) {
          cb(true);
        } else {
          cb(false);
        }
      },

      /**
       * Check if a user is an admin
       *
       * @return {Boolean}
       */
      isAdmin: function() {
        return (
          currentUser.role === "superadmin" || currentUser.role === "admin"
        );
      },
      isSuperAdmin: function() {
        return currentUser.role === "superadmin";
      },
      isAuctionAdmin: function() {
        return currentUser.role === "auctionadmin";
      },
      hasAccess: function(state) {
        if (!state) return false;
        if (currentUser.role === "superadmin") return true;
        if (
          state.allowedForCustomer &&
          userRoles.indexOf(currentUser.role) < userRoles.indexOf("admin")
        ) {
          if (state.role) {
            if (
              userRoles.indexOf(currentUser.role) >=
              userRoles.indexOf(state.role)
            )
              return true;
            else return false;
          }
          return true;
        }
        if (this.isAdmin() && currentUser.permission) {
          var permissionKey = State_Permission_Mapping[state.name];
          if (!permissionKey) return true;
          if (permissionKey.indexOf("$") !== -1) {
            var perKeys = permissionKey.split("$");
            return (
              currentUser.permission[perKeys[1]] &&
              currentUser.permission[permissionKey]
            );
          } else return currentUser.permission[permissionKey];
        } else return false;
      },
      userNotParticipateInAuction: function() {
        return (
          currentUser.role === "superadmin" ||
          currentUser.role === "admin" ||
          this.isAuctionAdmin() ||
          (this.isCustomer() && currentUser.isAuctionRegistration)
        );
      },
      isAuctionRegPermission: function() {
        if (currentUser.role === "superadmin") return true;
        if (this.isAdmin() && currentUser.permission)
          return currentUser.permission["auctionregistration$auctionmaster"];
        else if (
          this.isAuctionAdmin() &&
          currentUser.permission &&
          currentUser.permission["auctionregistration$auctionmaster"]
        )
          return true;
        else if (this.isCustomer() && currentUser.isAuctionRegistration)
          return true;
        else return false;
      },
      isAuctionButtonPermission: function(buttonType) {
        if (currentUser.role === "superadmin") return true;
        if (this.isAdmin() && currentUser.permission)
          return currentUser.permission["auctionregistration$auctionmaster"];
        if (this.isCustomer() && currentUser.isAuctionRegistration) return true;
        if (this.isAuctionAdmin() && currentUser.permission) {
          var permissionKey = State_Permission_Mapping[buttonType];
          if (!permissionKey) return false;
          if (permissionKey.indexOf("$") !== -1) {
            var perKeys = permissionKey.split("$");
            return (
              currentUser.permission[perKeys[1]] &&
              currentUser.permission[permissionKey]
            );
          } else return currentUser.permission[permissionKey];
        } else return false;
      },
      hasAccessRole: function(roleRequired) {
        return (
          userRoles.indexOf(currentUser.role) >= userRoles.indexOf(roleRequired)
        );
      },
      isBulkUpload: function() {
        return (
          this.isAdmin() ||
          this.isChannelPartner() ||
          this.isEnterprise() ||
          this.isRelationshipManager()
        );
      },
      isChannelPartner: function() {
        return currentUser.role === "channelpartner";
      },
      isRelationshipManager: function() {
        var retVal = false;
        retVal =
          currentUser.role === "enterprise" && currentUser.relationshipManager;
        if (currentUser.enterpriseId) retVal = false;
        return retVal;
      },
      isCoOwner: function() {
        return (
          currentUser.role === "enterprise" &&
          currentUser.coOwner &&
          currentUser.ownerId
        );
      },
      hasRole: function(role) {
        var retVal = false;
        retVal = currentUser.role === role;
        return retVal;
      },
      isEnterprise: function() {
        var retVal = false;
        retVal = currentUser.role === "enterprise" && currentUser.enterprise;
        if (!currentUser.enterpriseId) retVal = false;
        return retVal;
      },
      isEnterpriseUser: function() {
        var retVal = false;
        retVal = currentUser.role === "enterprise" && !currentUser.enterprise;
        if (!currentUser.enterpriseId) retVal = false;
        return retVal;
      },
      isServiceApprover: function(service) {
        if (!currentUser.availedServices) return false;
        for (var i = 0; i < currentUser.availedServices.length; i++) {
          if (
            currentUser.availedServices[i].code === service &&
            currentUser.availedServices[i].approver === true
          )
            return true;
        }
        return false;
      },
      isServiceRequester: function(service) {
        if (!currentUser.availedServices) return false;
        for (var i = 0; i < currentUser.availedServices.length; i++) {
          if (
            currentUser.availedServices[i].code === service &&
            currentUser.availedServices[i].requester === true
          )
            return true;
        }
        return false;
      },
      isApprovalRequired: function(service, enterpriseId, cb) {
        if (this.isEnterprise() && currentUser.availedServices) {
          for (var i = 0; i < currentUser.availedServices.length; i++) {
            if (
              currentUser.availedServices[i].code === service &&
              currentUser.availedServices[i].approvalRequired === "Yes"
            )
              return cb(true);
          }
          return cb(false);
        } else if (
          (this.isEnterpriseUser() ||
            this.isRelationshipManager() ||
            this.isAdmin()) &&
          currentUser.availedServices
        ) {
          var userFilter = {};
          userFilter.role = "enterprise";
          userFilter.enterprise = true;
          userFilter.enterpriseId = enterpriseId;
          userFilter.status = true;
          userSvc
            .getUsers(userFilter)
            .then(function(resData) {
              if (resData.length > 0) {
                for (var i = 0; i < resData[0].availedServices.length; i++) {
                  if (
                    resData[0].availedServices[i].code === service &&
                    resData[0].availedServices[i].approvalRequired === "Yes"
                  )
                    return cb(true);
                }
                return cb(false);
              } else return cb(true);
            })
            .catch(function(err) {
              return cb(true);
            });
        } else return cb(true);
      },
      isServiceAvailed: function(service) {
        if (currentUser.role === "admin" || currentUser.role === "superadmin")
          return true;
        if (currentUser.role === "customer") return true;
        if (currentUser.role === "channelpartner") return true;
        if (
          currentUser.isPartner ||
          (!currentUser.isPartner && currentUser.partnerId)
        )
          return true;
        if (
          currentUser.availedServices &&
          currentUser.availedServices.length > 0
        ) {
          for (var i = 0; i < currentUser.availedServices.length; i++) {
            if (currentUser.availedServices[i].code === service) return true;
          }
        }

        return false;
      },
      isPartner: function() {
        return currentUser.isPartner && currentUser.partnerId;
      },
      isPartnerUser: function() {
        return !currentUser.isPartner && currentUser.partnerId;
      },
      isValuationPartner: function() {
        if (
          currentUser &&
          currentUser.isPartner &&
          currentUser.partnerInfo &&
          currentUser.partnerInfo.services.length > 0
        )
          return currentUser.partnerInfo.services.indexOf("Valuation") > -1 ||
            currentUser.partnerInfo.services.indexOf("Inspection") > -1 ||
            currentUser.partnerInfo.services.indexOf("GPS Installation") > -1 ||
            currentUser.partnerInfo.services.indexOf("Photographs Only") > -1
            ? true
            : false;
        else if (
          currentUser &&
          !currentUser.isPartner &&
          currentUser.partnerId &&
          currentUser.partnerServices &&
          currentUser.partnerServices.length > 0
        )
          return currentUser.partnerServices.indexOf("Valuation") > -1 ||
            currentUser.partnerServices.indexOf("Inspection") > -1 ||
            currentUser.partnerInfo.services.indexOf("GPS Installation") > -1 ||
            currentUser.partnerInfo.services.indexOf("Photographs Only") > -1
            ? true
            : false;
        else return false;
      },
      isAuctionPartner: function() {
        if (
          currentUser &&
          currentUser.isPartner &&
          currentUser.partnerInfo &&
          currentUser.partnerInfo.services.length > 0
        )
          return currentUser.partnerInfo.services.indexOf("Auction") > -1
            ? true
            : false;
        else return false;
      },
      // isAuctionRegPermission: function() {
      //   if(currentUser && currentUser.isPartner && currentUser.partnerInfo && currentUser.partnerInfo.services.length > 0)
      //     return currentUser.partnerInfo.services.indexOf("Auction Registration") > -1 ? true : false;
      //   else
      //     return false;
      // },
      isFAgencyPartner: function() {
        if (
          currentUser &&
          currentUser.isPartner &&
          currentUser.partnerInfo &&
          currentUser.partnerInfo.services.length > 0
        )
          return currentUser.partnerInfo.services.indexOf("Sale Fulfilment") >
            -1
            ? true
            : false;
        else if (
          currentUser &&
          !currentUser.isPartner &&
          currentUser.partnerId &&
          currentUser.partnerServices &&
          currentUser.partnerServices.length > 0
        )
          return currentUser.partnerServices.indexOf("Sale Fulfilment") > -1
            ? true
            : false;
        else return false;
      },
      isBuySaleApprover: function() {
        if (this.isAdmin()) return true;
        if (currentUser.role !== "enterprise") return true;
        if (currentUser.enterprise) return true;
        if (currentUser.buySaleApprover) return true;
        else return false;
      },
      isBuySaleViewOnly: function(stateName) {
        if (this.isAdmin()) {
          var state = $state.get(stateName);
          return auth.hasAccess(state);
        }
        if (currentUser.role !== "enterprise") return true;
        if (currentUser.enterprise || currentUser.relationshipManager)
          return true;
        if (currentUser.buySaleViewOnly) return true;
        else return false;
      },
      isCustomer: function() {
        return currentUser.role === "customer";
      },
      isProfileIncomplete: function() {
        return currentUser.profileStatus === "incomplete";
      },

      /**
       * Get auth token
       */
      getToken: function() {
        return $cookieStore.get("token");
      },
      refreshUser: function() {
        if ($cookieStore.get("token")) {
          currentUser = User.get();
        }
      },
      removeCookies: function() {
        var cookieParams = [
          "sourcing_user_type",
          "sourcing_user_name",
          "sourcing_user_mobile",
          "location",
          "dealership_name",
          "access_token"
        ];
        cookieParams.forEach(function(param) {
          $cookies.remove(param, { domain: ".iquippo.com" });
        });
      },
      goToLogin: function() {
        var params = angular.copy($stateParams);
        params.state = $state.current.name;
        $state.go("iq.signin", params);
        //console.log("######",$state.current);
        //console.log("######",$stateParams);
      },
      autoLogin: function() {
        if ($cookieStore.get("token")) {
          currentUser = User.get();
          return currentUser;
        }
        return null;
      },

      getInfoSocailUser: function(id) {
        return $http
          .get("/api/users/getSocialUserInfo/" + id)
          .then(function(result) {
            return result.data;
          })
          .catch(function(error) {
            throw error;
          });
      },

      redirectToState: function() {
        var localCookieData = $cookieStore.get("state");
        if (localCookieData && localCookieData.navigatedFrom) {
          if (localCookieData.url) {
            $state.go(localCookieData.navigatedFrom, {
              slug: localCookieData.url
            });
          } else {
            $state.go(localCookieData.navigatedFrom);
          }
          $cookieStore.remove("state");
        } else {
          $state.go("iq.main");
        }
      },

      updateUserWithSocialInfo: function(user) {
        return $http
          .post("/api/users/updateUserWithSocialInfo", user)
          .then(function(result) {
            if (result && result.data) {
              currentUser = User.get();
            }
            return result.data;
          })
          .catch(function(error) {
            throw error;
          });
      },
      doNotRedirect: false,
      postLoginCallback: null
    };
    return auth;
  });
