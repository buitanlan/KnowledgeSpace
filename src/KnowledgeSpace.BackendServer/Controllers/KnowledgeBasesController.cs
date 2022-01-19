using KnowledgeSpace.BackendServer.Authorization;
using KnowledgeSpace.BackendServer.Constants;
using KnowledgeSpace.BackendServer.Data;
using KnowledgeSpace.BackendServer.Data.Entities;
using KnowledgeSpace.BackendServer.Helpers;
using KnowledgeSpace.BackendServer.Services;
using KnowledgeSpace.ViewModels;
using KnowledgeSpace.ViewModels.Contents;
using KnowledgeSpace.ViewModels.Systems;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace KnowledgeSpace.BackendServer.Controllers;

public partial class KnowledgeBasesController : BaseController
{
    private readonly ApplicationDbContext _context;
    private readonly ISequenceService _sequenceService;
    private readonly IStorageService _storageService;

    public KnowledgeBasesController(ApplicationDbContext context, 
        ISequenceService sequenceService,
        IStorageService storageService)
    {
        _context = context;
        _sequenceService = sequenceService;
        _storageService = storageService;
    }


    [HttpPost]
    [ClaimRequirement(FunctionCode.ContentKnowledgeBase,CommandCode.Create)]
    [ApiValidationFilter]
    public async Task<IActionResult> PostKnowledgeBase([FromForm] KnowledgeBaseCreateRequest request)
    {
        var knowledgeBase = CreateKnowledgeBaseEntity(request);
        knowledgeBase.Id = await _sequenceService.GetKnowledgeBaseNewId();
        if (request.Attachments is not null && request.Attachments.Count > 0)
        {
            foreach (var attachment in request.Attachments)
            {
                var attachmentEntity = await SaveFile(knowledgeBase.Id, attachment);
                if (attachmentEntity is not null)
                {
                    _context.Attachments.Add(attachmentEntity);

                }
            }
        }

        _context.KnowledgeBases.Add(knowledgeBase);
        //Process label
        if (!string.IsNullOrEmpty(request.Labels))
        {
            await ProcessLabel(request, knowledgeBase);
        }
        var result = await _context.SaveChangesAsync();

        if (result > 0)
        {
            return CreatedAtAction(nameof(GetById), new { id = knowledgeBase.Id }, request);
        }
        return BadRequest();
    }
        
        
    private static KnowledgeBase CreateKnowledgeBaseEntity(KnowledgeBaseCreateRequest request)
    {
        return new()
        {
            CategoryId = request.CategoryId,

            Title = request.Title,

            SeoAlias = request.SeoAlias,

            Description = request.Description,

            Environment = request.Environment,

            Problem = request.Problem,

            StepToReproduce = request.StepToReproduce,

            ErrorMessage = request.ErrorMessage,

            Workaround = request.Workaround,

            Note = request.Note,

            Labels = request.Labels,
        };
    }
        

    private async Task ProcessLabel(KnowledgeBaseCreateRequest request, KnowledgeBase knowledgeBase)
    {
        var labels = request.Labels.Split(',');
        foreach (var labelText in labels)
        {
            var labelId = TextHelper.ToUnsignedString(labelText);
            var existingLabel = await _context.Labels.AsNoTracking().SingleOrDefaultAsync(x =>x.Id == labelId);
            if (existingLabel is null)
            {
                var labelEntity = new Label
                {
                    Id = labelId,
                    Name = labelText
                };
                _context.Labels.Add(labelEntity);
            }
            var labelInKnowledgeBase = new LabelInKnowledgeBase
            {
                KnowledgeBaseId = knowledgeBase.Id,
                LabelId = labelId
            };
            _context.LabelInKnowledgeBases.Add(labelInKnowledgeBase);
        }
    }


    [HttpGet]
    [ClaimRequirement(FunctionCode.ContentKnowledgeBase,CommandCode.View)]
    public async Task<IActionResult> GetKnowledgeBases()
    {
        var knowledgeBaseVms = await _context.KnowledgeBases
            .AsNoTracking()
            .Select(u => new KnowledgeBaseQuickVm
            {
                Id = u.Id,
                CategoryId = u.CategoryId,
                Description = u.Description,
                SeoAlias = u.SeoAlias,
                Title = u.Title
            })
            .ToListAsync();

        return Ok(knowledgeBaseVms);
    }


    [HttpGet("filter")]
    [ClaimRequirement(FunctionCode.ContentKnowledgeBase,CommandCode.View)]
    public async Task<IActionResult> GetKnowledgeBasesPaging(string filter, int pageIndex, int pageSize)
    {
        var query = _context.KnowledgeBases.AsQueryable();
        if (!string.IsNullOrEmpty(filter))
        {
            query = query.Where(x => x.Title.Contains(filter));
        }
        var totalRecords = await query.AsNoTracking().CountAsync();
        var items = await query
            .AsNoTracking()
            .Skip((pageIndex - 1 * pageSize))
            .Take(pageSize)
            .Select(u => new KnowledgeBaseQuickVm
            {
                Id = u.Id,
                CategoryId = u.CategoryId,
                Description = u.Description,
                SeoAlias = u.SeoAlias,
                Title = u.Title
            })
            .ToListAsync();

        var pagination = new Pagination<KnowledgeBaseQuickVm>
        {
            Items = items,
            TotalRecords = totalRecords,
        };
        return Ok(pagination);
    }


    private static KnowledgeBaseVm CreateKnowledgeBaseVm(KnowledgeBase knowledgeBase)
    {
        return new()
        {
            Id = knowledgeBase.CategoryId,
            CategoryId = knowledgeBase.CategoryId,
            Title = knowledgeBase.Title,
            SeoAlias = knowledgeBase.SeoAlias,
            Description = knowledgeBase.Description,
            Environment = knowledgeBase.Environment,
            Problem = knowledgeBase.Problem,
            StepToReproduce = knowledgeBase.StepToReproduce,
            ErrorMessage = knowledgeBase.ErrorMessage,
            Workaround = knowledgeBase.Workaround,
            Note = knowledgeBase.Note,
            OwnerUserId = knowledgeBase.OwnerUserId,
            Labels = knowledgeBase.Labels,
            CreateDate = knowledgeBase.CreateDate,
            LastModifiedDate = knowledgeBase.LastModifiedDate,
            NumberOfComments = knowledgeBase.CategoryId,
            NumberOfVotes = knowledgeBase.CategoryId,
            NumberOfReports = knowledgeBase.CategoryId,
        };
    }


    [HttpGet("{id}")]
    [ClaimRequirement(FunctionCode.ContentKnowledgeBase,CommandCode.View)]
    public async Task<IActionResult> GetById(int id)
    {
        var knowledgeBase = await _context.KnowledgeBases.AsNoTracking().SingleOrDefaultAsync(x => x.Id == id);
        if (knowledgeBase is null)
            return NotFound(new ApiNotFoundResponse($"Cannot found knowledge base with id: {id}"));

        var knowledgeBaseVm = CreateKnowledgeBaseVm(knowledgeBase);
        return Ok(knowledgeBaseVm);
    }


    [HttpPut("{id}")]
    [ClaimRequirement(FunctionCode.ContentKnowledgeBase,CommandCode.Update)]
    [ApiValidationFilter]
    public async Task<IActionResult> PutKnowledgeBase(int id, [FromBody] KnowledgeBaseCreateRequest request)
    {
        var knowledgeBase = await _context.KnowledgeBases.AsNoTracking().SingleOrDefaultAsync(x => x.Id == id);
        if (knowledgeBase is null)
            return NotFound(new ApiNotFoundResponse($"Cannot found knowledge base with id {id}"));
        UpdateKnowledgeBase(request, knowledgeBase);
        _context.KnowledgeBases.Update(knowledgeBase);
        if (!string.IsNullOrEmpty(request.Labels))
        {
            await ProcessLabel(request, knowledgeBase);
        }
        var result = await _context.SaveChangesAsync();

        if (result > 0)
        {
            return NoContent();
        }
        return BadRequest(new ApiBadRequestResponse("Update knowledge base failed"));
    }


    [HttpDelete("{id}")]
    [ClaimRequirement(FunctionCode.ContentKnowledgeBase,CommandCode.Delete)]
    public async Task<IActionResult> DeleteKnowledgeBase(int id)
    {
        var knowledgeBase = await _context.KnowledgeBases.AsNoTracking().SingleOrDefaultAsync(x => x.Id == id);
        if (knowledgeBase is null)
            return NotFound(new ApiNotFoundResponse($"Cannot find knowledge base with {id}"));

        _context.KnowledgeBases.Remove(knowledgeBase);
        var result = await _context.SaveChangesAsync();
        if (result <= 0) return BadRequest(new ApiBadRequestResponse("Cannot delete this knowledge Base"));
        var knowledgeBaseVm = CreateKnowledgeBaseVm(knowledgeBase);
        return Ok(knowledgeBaseVm);
    }
        
    private static void UpdateKnowledgeBase(KnowledgeBaseCreateRequest request, KnowledgeBase knowledgeBase)
    {
        knowledgeBase.CategoryId = request.CategoryId;
        knowledgeBase.Title = request.Title;
        knowledgeBase.SeoAlias = request.SeoAlias;
        knowledgeBase.Description = request.Description;
        knowledgeBase.Environment = request.Environment;
        knowledgeBase.Problem = request.Problem;
        knowledgeBase.StepToReproduce = request.StepToReproduce;
        knowledgeBase.ErrorMessage = request.ErrorMessage;
        knowledgeBase.Workaround = request.Workaround;
        knowledgeBase.Note = request.Note;
        knowledgeBase.Labels = request.Labels;
    }
}