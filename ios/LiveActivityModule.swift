//
//  LiveActivityModule.swift
//  ZortiMet
//
//  Created by devlogix on 2023-11-08.
//

import Foundation
import ActivityKit
@objc(LiveActivity)

class LiveActivity: NSObject{
  @objc(startActivity)
  
  func startActivity(){
    
    do{
      if #available(iOS 16.1, *){
        let liveActivityAttributes = LiveActivityAttributes(name: "Live Activity")
        
        let liveActivityContentState = LiveActivityAttributes.ContentState(estimateDeliveryTime: Date()...Date().addingTimeInterval(3*60), color: "green")
        
        
        let activity = try Activity<LiveActivityAttributes>.request(attributes: liveActivityAttributes, contentState:  liveActivityContentState, pushType:.token)
        
        Task { for await data in activity.pushTokenUpdates {
          let myToken = data.map{dat in String(format: "%02.2hhx", dat)
          }
          let token = myToken.joined()
                                         // Keep this myToken for sending push notificatio
          print("New Push Token", token)
        }
        }


      }
      else{
        print("Dynamic Island and Live Activities not supported")
      }
    }catch(_){
      print("error in live activity")
    }
   
  }
  
  
  
  
  @objc(updateActivity:)
  func updateActivity(name: String){
    
    do{
      if #available(iOS 16.1, *){
        let liveActivityContentSatte = LiveActivityAttributes.ContentState(estimateDeliveryTime: Date()...Date().addingTimeInterval(10*20),  color: "yellow")
        Task{
          var alertConfig:AlertConfiguration? = nil
          
          alertConfig = AlertConfiguration(title: "Zts Meeting Alert", body: "your Meeting about to start", sound: .default)

          for activity in Activity<LiveActivityAttributes>.activities {
            await activity.update(using: liveActivityContentSatte, alertConfiguration: alertConfig)
          }
        }
      }
    }catch(_){
      print("some error")
    }
  }
  
  
  
  @objc(endActivity)
   func endActivity(){
     Task{
       for activity in Activity<LiveActivityAttributes>.activities {
         await activity.end()
       }
     }
   }
}
