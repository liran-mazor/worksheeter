// insights/src/jobs/weekly-teacher-digest.ts
import { AnalyticsService } from '../services/analytics.service';

export async function generateWeeklyDigest() {
  console.log('📊 WEEKLY TEACHER DIGEST - ' + new Date().toDateString());
  console.log('='.repeat(60));
  
  // Struggling worksheets
  const struggling = await AnalyticsService.getLowPerformingWorksheets(60);
  console.log(`\n⚠️  WORKSHEETS NEEDING ATTENTION (≤60% average):`);
  if (struggling.length === 0) {
    console.log('   🎉 Excellent! No worksheets below 60% this week.');
  } else {
    struggling.forEach(w => {
      console.log(`   • "${w.worksheetTitle}": ${w.averageScore.toFixed(1)}% (${w.studentCount} students)`);
    });
  }
  
  // Top performing worksheets  
  const topPerforming = await AnalyticsService.getTopPerformingWorksheets(90);
  console.log(`\n🏆 TOP PERFORMING WORKSHEETS (≥90% average):`);
  if (topPerforming.length === 0) {
    console.log('   📚 No worksheets above 90% yet - room for improvement!');
  } else {
    topPerforming.forEach(w => {
      console.log(`   • "${w.worksheetTitle}": ${w.averageScore.toFixed(1)}% (${w.studentCount} students)`);
    });
  }
  
  // Overall stats
  const totalWorksheets = await AnalyticsService.getTotalWorksheetsCount();
  const overallAverage = await AnalyticsService.getOverallPlatformAverage();
  
  console.log(`\n📈 PLATFORM SUMMARY:`);
  console.log(`   • Total active worksheets: ${totalWorksheets}`);
  console.log(`   • Platform average score: ${overallAverage.toFixed(1)}%`);
  
  console.log('\n' + '='.repeat(60));
}