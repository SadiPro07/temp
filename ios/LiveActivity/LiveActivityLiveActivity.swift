//
//  LiveActivityLiveActivity.swift
//  LiveActivity
//
//  Created by devlogix on 2023-11-08.
//

import ActivityKit
import WidgetKit
import SwiftUI

struct LiveActivityAttributes: ActivityAttributes {
    public struct ContentState: Codable, Hashable {
      // Dynamic stateful properties about your activity go here!
      var estimateDeliveryTime: ClosedRange<Date>
    var color:String
    }

    // Fixed non-changing properties about your activity go here!
    var name: String
  var date = Date()...Date().addingTimeInterval(20*30)
}

struct TimerProgressViewStyle: ProgressViewStyle
{
  var thresholdGreen: Double
  var thresholdYellow: Double
  
  
  init(thresholdGreen: Double, thresholdYellow: Double) {
    self.thresholdGreen = thresholdGreen
    self.thresholdYellow = thresholdYellow
  }
  
  func makeBody(configuration: Configuration) -> some View {
    let fractionCompleted = configuration.fractionCompleted ?? 0.0
    
    // Calculate the color based on progress
    var color: Color
    if fractionCompleted <= thresholdGreen {
      color = .green
    } else if fractionCompleted <= thresholdYellow {
      color = .yellow
    } else {
      color = .red
    }
    
    return ZStack {
      Circle()
        .trim(from: 0.0, to: CGFloat(fractionCompleted))
        .stroke(color, lineWidth: 10)
        .rotationEffect(.degrees(-90))
        .animation(.linear)
    }
  }
}

struct LiveActivityLiveActivity: Widget {
  var body: some WidgetConfiguration {
    ActivityConfiguration(for: LiveActivityAttributes.self) {
      
      context in
      ZStack {
        Color(.systemBackground)
          .edgesIgnoringSafeArea(.all)
        
        VStack(alignment: .leading) {
          Text("Meeting Name")
            .font(.headline)
            .padding(.top, 10)
          
          Text("Meeting Date & Time")
            .font(.subheadline)
            .foregroundColor(.secondary)
          
          
          
          HStack {
            
            
            Button(action: {
              // Action for the second button
            }) {
              Text("Google Meeting")
                .font(.headline)
                .foregroundColor(.white)
                .padding()
                .background(Color.red)
                .cornerRadius(10)
              
            }
            Spacer()
            ProgressView(timerInterval: context.state.estimateDeliveryTime,
                         countsDown: false,
                         label: {
              EmptyView()
            },
                         currentValueLabel: {
              
              Text(timerInterval:
                    context.state.estimateDeliveryTime, countsDown: true)
              .multilineTextAlignment(.center)
              .monospacedDigit()
              .font(.caption2)                  }
            ).progressViewStyle(CircularProgressViewStyle(tint: Color.blue))
              .frame(width: 80,height:80, alignment: .center)
              .padding(.bottom, 10)
            
          }
          
        }
        .padding(.horizontal)
      }
      // .background(Color.white)
      // .foregroundColor(.black)
    }
  dynamicIsland: { context in
    DynamicIsland {
      // Expanded UI goes here.  Compose the expanded UI through
      // various regions, like leading/trailing/center/bottom
      DynamicIslandExpandedRegion(.leading) {
        Text("Your Meeting")
      }
      DynamicIslandExpandedRegion(.trailing) {
        Text("Zts")
      }
      DynamicIslandExpandedRegion(.center) {
      
        // Text("your ZTS Meeting")
        // more content
        
        if(context.state.color == "green")
        {
          ProgressView(timerInterval: context.attributes.date,
                       countsDown: false,
                       label: {
            EmptyView()
          },
                       currentValueLabel: {
            
            Text(timerInterval:
                  context.state.estimateDeliveryTime, countsDown: true)
            .multilineTextAlignment(.center)
            .monospacedDigit()
            .font(.caption2)                  }
          ).progressViewStyle(CircularProgressViewStyle(tint: .green))
            .frame(width: 80,height:80, alignment: .center)
            .padding(.bottom, 10)
        }
        else if(context.state.color == "yellow")
        {
          ProgressView(timerInterval: context.state.estimateDeliveryTime,
                       countsDown: false,
                       label: {
            EmptyView()
          },
                       currentValueLabel: {
            
            Text(timerInterval:
                  context.attributes.date, countsDown: true)
            .multilineTextAlignment(.center)
            .monospacedDigit()
            .font(.caption2)                  }
          ).progressViewStyle(CircularProgressViewStyle(tint: .yellow))
            .frame(width: 80,height:80, alignment: .center)
            .padding(.bottom, 10)
        }
      }
    }
  compactLeading: {
    
    //Image(systemName: "titiIcon")
    // .foregroundColor(.yellow)
    //.padding(.leading, 4)
    ProgressView(timerInterval: context.state.estimateDeliveryTime,
                 countsDown: false,
                 label: {
      EmptyView()
    },
                 currentValueLabel: {
      
      EmptyView()
    }
    ).progressViewStyle(TimerProgressViewStyle(thresholdGreen: 0.4, thresholdYellow: 0.7))
    //  .frame(width: 80,height:80, alignment: .center)
    
    
    
  } compactTrailing: {
    Text(timerInterval: context.state.estimateDeliveryTime, countsDown: true)
      .multilineTextAlignment(.center)
      .frame(width: 40)
      .foregroundColor(.yellow)
      .padding(.trailing, 4)
    
    .font(.caption2)            }
  minimal: {
    VStack(alignment: .center) {
      Image(systemName: "")
      Text(timerInterval:
            context.state.estimateDeliveryTime, countsDown: true)
      .multilineTextAlignment(.center)
      .monospacedDigit()
      .font(.caption2)
    }}
  .widgetURL(URL(string: "http://www.apple.com"))
  .keylineTint(Color.red)
  }
  }
}

